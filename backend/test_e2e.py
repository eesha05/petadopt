import os
import sys
import asyncio
import httpx
from app.main import app

async def run_tests():
    print("=== STARTING END-TO-END PET ADOPTION PORTAL TESTS ===")
    
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        # 1. Public Pets API
        print("\n[TEST 1] Testing Public Pets API...")
        res = await client.get("/api/pets")
        assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
        pets = res.json()
        print(f"-> Total pets found: {len(pets)}")
        assert len(pets) >= 15, "Expected at least 15 pets in database"
        
        # Verify image URLs and species diversity
        species_set = set()
        for pet in pets:
            assert "image_url" in pet and pet["image_url"], f"Pet {pet.get('name')} missing image_url!"
            assert pet["image_url"].startswith("http"), f"Pet {pet.get('name')} has invalid image_url: {pet['image_url']}"
            species_set.add(pet.get("species"))
        
        print(f"-> Species found in catalog: {sorted(list(species_set))}")
        required_species = {"Dog", "Cat", "Bird", "Hamster", "Rabbit", "Guinea Pig", "Turtle"}
        assert required_species.issubset(species_set), f"Missing species! Found: {species_set}, Expected subset of: {required_species}"
        print("-> Image URLs and species diversity: PASSED")

        # Test filtering by species
        bird_res = await client.get("/api/pets?species=Bird")
        assert bird_res.status_code == 200
        birds = bird_res.json()
        assert len(birds) >= 3, f"Expected at least 3 birds, got {len(birds)}"
        for b in birds:
            assert b["species"] == "Bird"
        print(f"-> Species filtering ('Bird'): PASSED ({len(birds)} birds found)")

        # 2. Adopter Authentication & Wishlist
        print("\n[TEST 2] Testing Adopter Auth & Wishlist Flow...")
        login_res = await client.post("/api/auth/login", data={"username": "adopter@example.com", "password": "password123"})
        assert login_res.status_code == 200, f"Adopter login failed: {login_res.text}"
        adopter_token = login_res.json()["access_token"]
        adopter_headers = {"Authorization": f"Bearer {adopter_token}"}
        print("-> Adopter login: PASSED")

        # Pick a pet for wishlist test
        test_pet = pets[0]
        pet_id = test_pet["id"]

        # Clear wishlist first if already there
        await client.delete(f"/api/wishlist/{pet_id}", headers=adopter_headers)

        # Add to wishlist
        add_wl_res = await client.post(f"/api/wishlist/{pet_id}", headers=adopter_headers)
        assert add_wl_res.status_code == 200, f"Add to wishlist failed: {add_wl_res.text}"
        
        # Get wishlist IDs
        ids_res = await client.get("/api/wishlist/ids", headers=adopter_headers)
        assert ids_res.status_code == 200
        assert pet_id in ids_res.json(), f"Pet {pet_id} not in wishlist IDs!"
        print(f"-> Add to Wishlist & Fetch IDs: PASSED (Pet {pet_id} saved)")

        # Get full wishlist
        wl_list_res = await client.get("/api/wishlist", headers=adopter_headers)
        assert wl_list_res.status_code == 200
        wl_items = wl_list_res.json()
        assert any(item["pet_id"] == pet_id for item in wl_items)
        print("-> Fetch Wishlist items: PASSED")

        # Remove from wishlist
        del_wl_res = await client.delete(f"/api/wishlist/{pet_id}", headers=adopter_headers)
        assert del_wl_res.status_code == 200
        ids_after = (await client.get("/api/wishlist/ids", headers=adopter_headers)).json()
        assert pet_id not in ids_after
        print("-> Remove from Wishlist: PASSED")

        # 3. Adoption Request Submission
        print("\n[TEST 3] Testing Adoption Request Form Submission...")
        # Find an available pet
        available_pets = [p for p in pets if p["status"] == "available"]
        assert len(available_pets) > 0, "No available pets found for test!"
        adoption_pet = available_pets[-1] # use the last available pet
        adopt_pet_id = adoption_pet["id"]

        adoption_payload = {
            "pet_id": adopt_pet_id,
            "full_name": "Jane Adopter",
            "email": "adopter@example.com",
            "phone": "+1-555-0199",
            "city": "Springfield",
            "address": "742 Evergreen Terrace",
            "housing_type": "independent house",
            "own_or_rent": "own",
            "pets_permitted": True,
            "experience": "Have owned companion animals for over 8 years.",
            "other_pets": "None at present.",
            "daily_availability": "4-6 hours daily with fenced yard.",
            "reason": "Looking to provide a loving, safe forever home.",
            "agreed_to_terms": True
        }

        # Submit application
        app_res = await client.post("/api/adoption-requests", json=adoption_payload, headers=adopter_headers)
        if app_res.status_code == 400 and "already submitted" in app_res.text:
            print(f"-> Application already exists for pet {adopt_pet_id}, verifying duplicate prevention: PASSED")
        else:
            assert app_res.status_code == 201, f"Failed to submit adoption application: {app_res.text}"
            print(f"-> Adoption application submitted successfully: PASSED (ID: {app_res.json()['id']})")
            
            # Verify duplicate prevention
            dup_res = await client.post("/api/adoption-requests", json=adoption_payload, headers=adopter_headers)
            assert dup_res.status_code == 400, "Duplicate submission was not prevented!"
            print("-> Duplicate application prevention: PASSED (Returned 400)")

        # Fetch adopter's applications
        my_apps_res = await client.get("/api/adoption-requests/my", headers=adopter_headers)
        assert my_apps_res.status_code == 200
        my_apps = my_apps_res.json()
        assert len(my_apps) > 0, "No applications returned for adopter!"
        print(f"-> Adopter view applications: PASSED ({len(my_apps)} requests found)")

        # 4. Shelter Review Flow
        print("\n[TEST 4] Testing Shelter Management & Review Flow...")
        shelter_login_res = await client.post("/api/auth/login", data={"username": "shelter@example.com", "password": "password123"})
        assert shelter_login_res.status_code == 200, f"Shelter login failed: {shelter_login_res.text}"
        shelter_token = shelter_login_res.json()["access_token"]
        shelter_headers = {"Authorization": f"Bearer {shelter_token}"}
        print("-> Shelter login: PASSED")

        # Fetch shelter's pets
        my_pets_res = await client.get("/api/pets/my", headers=shelter_headers)
        assert my_pets_res.status_code == 200
        print(f"-> Shelter listed pets: PASSED ({len(my_pets_res.json())} pets listed)")

        # Fetch shelter's incoming requests
        shelter_reqs_res = await client.get("/api/adoption-requests/shelter", headers=shelter_headers)
        assert shelter_reqs_res.status_code == 200
        shelter_reqs = shelter_reqs_res.json()
        print(f"-> Shelter incoming requests: PASSED ({len(shelter_reqs)} incoming requests)")

        # 5. Admin Dashboard & Moderation
        print("\n[TEST 5] Testing Admin Dashboard & Moderation Flow...")
        admin_login_res = await client.post("/api/auth/login", data={"username": "admin@example.com", "password": "password123"})
        assert admin_login_res.status_code == 200, f"Admin login failed: {admin_login_res.text}"
        admin_token = admin_login_res.json()["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        print("-> Admin login: PASSED")

        # Admin stats
        stats_res = await client.get("/api/admin/stats", headers=admin_headers)
        assert stats_res.status_code == 200
        stats = stats_res.json()
        print(f"-> Admin Stats: {stats}")
        assert stats["total_users"] > 0
        assert stats["total_pets"] >= 15
        print("-> Admin stats metrics: PASSED")

        # Admin all requests
        all_reqs_res = await client.get("/api/admin/requests", headers=admin_headers)
        assert all_reqs_res.status_code == 200
        print(f"-> Admin view all adoption requests: PASSED ({len(all_reqs_res.json())} requests)")

    print("\n========================================================")
    print("ALL END-TO-END TESTS COMPLETED SUCCESSFULLY!")
    print("========================================================")

if __name__ == "__main__":
    asyncio.run(run_tests())
