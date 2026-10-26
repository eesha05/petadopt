import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Mithoo21@localhost:5432/petadoption")

NEW_PETS = [
    # Dogs
    {
        "shelter_id": 1,
        "name": "Rocky",
        "species": "Dog",
        "breed": "Labrador Retriever",
        "age": 2,
        "gender": "Male",
        "size": "Large",
        "location": "123 Rescue St, Cityville",
        "description": "Energetic, water-loving yellow Labrador who loves retrieving tennis balls and learning new tricks.",
        "health_info": "Vaccinated, dewormed, healthy hips.",
        "vaccination_status": "Up to date",
        "sterilized": True,
        "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800",
        "status": "available"
    },
    # Cats
    {
        "shelter_id": 1,
        "name": "Milo",
        "species": "Cat",
        "breed": "Domestic Shorthair",
        "age": 1,
        "gender": "Male",
        "size": "Medium",
        "location": "123 Rescue St, Cityville",
        "description": "Playful and curious tabby cat who enjoys sunny window sills and chasing feather toys.",
        "health_info": "FIV/FeLV negative, vaccinated, neutered.",
        "vaccination_status": "Up to date",
        "sterilized": True,
        "image_url": "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=800",
        "status": "available"
    },
    # Birds
    {
        "shelter_id": 2,
        "name": "Kiwi",
        "species": "Bird",
        "breed": "Budgerigar",
        "age": 1,
        "gender": "Female",
        "size": "Small",
        "location": "456 Safe Haven Ln, Greenhill",
        "description": "Chirpy, social green budgie who loves singing along to soft music and eating millet treats.",
        "health_info": "Healthy plumage, clear respiratory check.",
        "vaccination_status": "Not required",
        "sterilized": False,
        "image_url": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&q=80&w=800",
        "status": "available"
    },
    {
        "shelter_id": 2,
        "name": "Sunny",
        "species": "Bird",
        "breed": "Cockatiel",
        "age": 2,
        "gender": "Male",
        "size": "Small",
        "location": "456 Safe Haven Ln, Greenhill",
        "description": "Sweet crested cockatiel who knows how to whistle simple tunes and loves head scratches.",
        "health_info": "Veterinary avian health certificate provided.",
        "vaccination_status": "Not required",
        "sterilized": False,
        "image_url": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800",
        "status": "available"
    },
    {
        "shelter_id": 1,
        "name": "Mango",
        "species": "Bird",
        "breed": "Lovebird",
        "age": 1,
        "gender": "Female",
        "size": "Small",
        "location": "123 Rescue St, Cityville",
        "description": "Vibrant and lively peach-faced lovebird looking for an attentive companion home.",
        "health_info": "Healthy beak, nails trimmed, regular avian checkup.",
        "vaccination_status": "Not required",
        "sterilized": False,
        "image_url": "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800",
        "status": "available"
    },
    {
        "shelter_id": 2,
        "name": "Rio",
        "species": "Bird",
        "breed": "Parrot",
        "age": 3,
        "gender": "Male",
        "size": "Medium",
        "location": "456 Safe Haven Ln, Greenhill",
        "description": "Intelligent parrot with great mimicry skills. Needs an experienced bird lover with spacious setup.",
        "health_info": "Avian vet checked, clean bill of health.",
        "vaccination_status": "Not required",
        "sterilized": False,
        "image_url": "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&q=80&w=800",
        "status": "available"
    },
    # Hamsters
    {
        "shelter_id": 2,
        "name": "Nibbles",
        "species": "Hamster",
        "breed": "Syrian Hamster",
        "age": 1,
        "gender": "Male",
        "size": "Small",
        "location": "456 Safe Haven Ln, Greenhill",
        "description": "Gentle golden Syrian hamster who enjoys running on an exercise wheel and burrowing in soft bedding.",
        "health_info": "Healthy teeth and coat, active at dusk.",
        "vaccination_status": "Not required",
        "sterilized": False,
        "image_url": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=800",
        "status": "available"
    },
    {
        "shelter_id": 1,
        "name": "Peanut",
        "species": "Hamster",
        "breed": "Roborovski Dwarf Hamster",
        "age": 1,
        "gender": "Female",
        "size": "Small",
        "location": "123 Rescue St, Cityville",
        "description": "Tiny and quick dwarf hamster who loves foraging for seeds and climbing wooden bridges.",
        "health_info": "Healthy, parasite-free.",
        "vaccination_status": "Not required",
        "sterilized": False,
        "image_url": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&q=80&w=800",
        "status": "available"
    },
    # Rabbits
    {
        "shelter_id": 2,
        "name": "Thumper",
        "species": "Rabbit",
        "breed": "Lionhead Rabbit",
        "age": 2,
        "gender": "Male",
        "size": "Small",
        "location": "456 Safe Haven Ln, Greenhill",
        "description": "Fluffy lionhead rabbit who is litter-box trained and loves fresh timothy hay and leafy greens.",
        "health_info": "Neutered, regular dental checks passed.",
        "vaccination_status": "Up to date",
        "sterilized": True,
        "image_url": "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&q=80&w=800",
        "status": "available"
    },
    # Guinea Pigs
    {
        "shelter_id": 2,
        "name": "Pip",
        "species": "Guinea Pig",
        "breed": "American Guinea Pig",
        "age": 1,
        "gender": "Male",
        "size": "Small",
        "location": "456 Safe Haven Ln, Greenhill",
        "description": "Affectionate guinea pig who makes happy squeaking sounds when he hears the vegetable drawer opening.",
        "health_info": "Healthy vitamin C supplementation, clean coat.",
        "vaccination_status": "Not required",
        "sterilized": False,
        "image_url": "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=800",
        "status": "available"
    },
    # Turtles
    {
        "shelter_id": 1,
        "name": "Shelly",
        "species": "Turtle",
        "breed": "Red-Eared Slider",
        "age": 3,
        "gender": "Female",
        "size": "Small",
        "location": "123 Rescue St, Cityville",
        "description": "Calm aquatic turtle who enjoys basking under UV heat lamps and swimming in filtered tank environments.",
        "health_info": "Hard, healthy shell, no pyramiding or signs of deficiency.",
        "vaccination_status": "Not required",
        "sterilized": False,
        "image_url": "https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&q=80&w=800",
        "status": "available"
    },
    {
        "shelter_id": 2,
        "name": "Franklin",
        "species": "Turtle",
        "breed": "Eastern Box Turtle",
        "age": 5,
        "gender": "Male",
        "size": "Small",
        "location": "456 Safe Haven Ln, Greenhill",
        "description": "Terrestrial turtle suitable for a secure garden pen or indoor terrarium with moist substrate.",
        "health_info": "Exotic vet health check complete.",
        "vaccination_status": "Not required",
        "sterilized": False,
        "image_url": "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&q=80&w=800",
        "status": "available"
    }
]

def seed_diverse_pets():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    # Fix broken URLs on existing pets
    cur.execute("""
        UPDATE pets 
        SET image_url = 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&q=80&w=800'
        WHERE id = 4 AND name = 'Bella';
    """)
    cur.execute("""
        UPDATE pets 
        SET image_url = 'https://images.unsplash.com/photo-1589952283406-b53a7d1347e8?auto=format&fit=crop&q=80&w=800'
        WHERE id = 6 AND name = 'Lucy';
    """)

    # Insert new pets safely without duplicates
    inserted = 0
    for pet in NEW_PETS:
        cur.execute("""
            SELECT id FROM pets WHERE name = %s AND species = %s AND breed = %s;
        """, (pet["name"], pet["species"], pet["breed"]))
        if not cur.fetchone():
            cur.execute("""
                INSERT INTO pets (
                    shelter_id, name, species, breed, age, gender, size,
                    location, description, health_info, vaccination_status,
                    sterilized, image_url, status
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """, (
                pet["shelter_id"], pet["name"], pet["species"], pet["breed"],
                pet["age"], pet["gender"], pet["size"], pet["location"],
                pet["description"], pet["health_info"], pet["vaccination_status"],
                pet["sterilized"], pet["image_url"], pet["status"]
            ))
            inserted += 1

    conn.commit()
    print(f"Seeded {inserted} new pets across multiple species. Existing broken URLs updated.")
    
    cur.execute("SELECT species, count(*) FROM pets GROUP BY species ORDER BY count(*) DESC;")
    for row in cur.fetchall():
        print(f"Species: {row[0]}, Count: {row[1]}")

    conn.close()

if __name__ == "__main__":
    seed_diverse_pets()
