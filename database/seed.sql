-- Insert Users
-- Passwords are 'password123' hashed with bcrypt
-- Admin
INSERT INTO users (name, email, password_hash, role, phone, address) VALUES
('Admin User', 'admin@example.com', '$2b$12$mDO32.8i/becd..FDRRBe.cHXXONKK6HNoq34c504LTjkI30UFyv2', 'admin', '1234567890', 'Admin HQ');

-- Shelters
INSERT INTO users (name, email, password_hash, role, phone, address) VALUES
('Happy Paws', 'shelter1@example.com', '$2b$12$mDO32.8i/becd..FDRRBe.cHXXONKK6HNoq34c504LTjkI30UFyv2', 'shelter', '555-0101', '123 Rescue St, Cityville'),
('Furry Friends', 'shelter2@example.com', '$2b$12$mDO32.8i/becd..FDRRBe.cHXXONKK6HNoq34c504LTjkI30UFyv2', 'shelter', '555-0102', '456 Safe Haven Ln, Greenhill');

-- Adopters
INSERT INTO users (name, email, password_hash, role, phone, address) VALUES
('Alice Smith', 'adopter1@example.com', '$2b$12$mDO32.8i/becd..FDRRBe.cHXXONKK6HNoq34c504LTjkI30UFyv2', 'adopter', '555-0201', '789 Adopter Ave, Cityville'),
('Bob Johnson', 'adopter2@example.com', '$2b$12$mDO32.8i/becd..FDRRBe.cHXXONKK6HNoq34c504LTjkI30UFyv2', 'adopter', '555-0202', '321 Pet Lover Rd, Cityville'),
('Charlie Brown', 'adopter3@example.com', '$2b$12$mDO32.8i/becd..FDRRBe.cHXXONKK6HNoq34c504LTjkI30UFyv2', 'adopter', '555-0203', '654 Home St, Greenhill');

-- Insert Shelters
INSERT INTO shelters (user_id, organization_name, description, address) VALUES
(2, 'Happy Paws Rescue', 'Dedicated to finding homes for stray dogs and cats.', '123 Rescue St, Cityville'),
(3, 'Furry Friends Haven', 'Specializing in small animals, birds, and senior pets.', '456 Safe Haven Ln, Greenhill');

-- Insert Diverse Pets
INSERT INTO pets (shelter_id, name, species, breed, age, gender, size, location, description, health_info, vaccination_status, sterilized, image_url, status) VALUES
(1, 'Buddy', 'Dog', 'Golden Retriever', 3, 'Male', 'Large', '123 Rescue St, Cityville', 'Friendly, gentle, and energetic family dog.', 'Healthy, hips clear', 'Up to date', true, 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800', 'available'),
(1, 'Luna', 'Cat', 'Siamese', 2, 'Female', 'Medium', '123 Rescue St, Cityville', 'Vocal and affectionate lap cat.', 'FIV/FeLV negative', 'Up to date', true, 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=800', 'available'),
(1, 'Max', 'Dog', 'German Shepherd', 1, 'Male', 'Large', '123 Rescue St, Cityville', 'Loyal, intelligent, and protective companion.', 'Healthy', 'Up to date', false, 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=800', 'available'),
(2, 'Bella', 'Dog', 'Beagle', 4, 'Female', 'Medium', '456 Safe Haven Ln, Greenhill', 'Friendly hound dog who loves sniffing trails.', 'Healthy', 'Up to date', true, 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&q=80&w=800', 'available'),
(2, 'Charlie', 'Cat', 'Persian', 5, 'Male', 'Small', '456 Safe Haven Ln, Greenhill', 'Calm and loves lounging in sunny spots.', 'Special kidney care diet', 'Up to date', true, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800', 'available'),
(2, 'Lucy', 'Rabbit', 'Holland Lop', 1, 'Female', 'Small', '456 Safe Haven Ln, Greenhill', 'Active and playful bunny who enjoys fresh greens.', 'Healthy teeth and ears', 'Not applicable', false, 'https://images.unsplash.com/photo-1589952283406-b53a7d1347e8?auto=format&fit=crop&q=80&w=800', 'available'),
(1, 'Rocky', 'Dog', 'Labrador Retriever', 2, 'Male', 'Large', '123 Rescue St, Cityville', 'Energetic, water-loving yellow Labrador.', 'Healthy hips', 'Up to date', true, 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800', 'available'),
(1, 'Milo', 'Cat', 'Domestic Shorthair', 1, 'Male', 'Medium', '123 Rescue St, Cityville', 'Playful and curious tabby cat who enjoys feather toys.', 'FIV/FeLV negative', 'Up to date', true, 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=800', 'available'),
(2, 'Kiwi', 'Bird', 'Budgerigar', 1, 'Female', 'Small', '456 Safe Haven Ln, Greenhill', 'Chirpy, social green budgie who loves singing.', 'Clear respiratory check', 'Not required', false, 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&q=80&w=800', 'available'),
(2, 'Sunny', 'Bird', 'Cockatiel', 2, 'Male', 'Small', '456 Safe Haven Ln, Greenhill', 'Sweet crested cockatiel that whistles tunes.', 'Avian health check certified', 'Not required', false, 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800', 'available'),
(1, 'Mango', 'Bird', 'Lovebird', 1, 'Female', 'Small', '123 Rescue St, Cityville', 'Vibrant and lively peach-faced lovebird.', 'Healthy beak and nails', 'Not required', false, 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800', 'available'),
(2, 'Rio', 'Bird', 'Parrot', 3, 'Male', 'Medium', '456 Safe Haven Ln, Greenhill', 'Intelligent parrot with great mimicry skills.', 'Clean bill of health', 'Not required', false, 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&q=80&w=800', 'available'),
(2, 'Nibbles', 'Hamster', 'Syrian Hamster', 1, 'Male', 'Small', '456 Safe Haven Ln, Greenhill', 'Gentle golden Syrian hamster who loves burrowing.', 'Healthy teeth and coat', 'Not required', false, 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=800', 'available'),
(1, 'Peanut', 'Hamster', 'Roborovski Dwarf Hamster', 1, 'Female', 'Small', '123 Rescue St, Cityville', 'Tiny and quick dwarf hamster who loves running.', 'Healthy', 'Not required', false, 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&q=80&w=800', 'available'),
(2, 'Thumper', 'Rabbit', 'Lionhead Rabbit', 2, 'Male', 'Small', '456 Safe Haven Ln, Greenhill', 'Fluffy lionhead rabbit who is litter-trained.', 'Neutered, clear dental check', 'Up to date', true, 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&q=80&w=800', 'available'),
(2, 'Pip', 'Guinea Pig', 'American Guinea Pig', 1, 'Male', 'Small', '456 Safe Haven Ln, Greenhill', 'Affectionate guinea pig who makes happy squeaks.', 'Vitamin C supplemented', 'Not required', false, 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=800', 'available'),
(1, 'Shelly', 'Turtle', 'Red-Eared Slider', 3, 'Female', 'Small', '123 Rescue St, Cityville', 'Calm aquatic turtle who enjoys basking under UV lamps.', 'Smooth healthy shell', 'Not required', false, 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&q=80&w=800', 'available'),
(2, 'Franklin', 'Turtle', 'Eastern Box Turtle', 5, 'Male', 'Small', '456 Safe Haven Ln, Greenhill', 'Terrestrial turtle suitable for a secure garden pen.', 'Exotic vet check passed', 'Not required', false, 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&q=80&w=800', 'available');

-- Insert Initial Adoption Requests with detailed fields
INSERT INTO adoption_requests (
    pet_id, adopter_id, full_name, phone, city, address,
    housing_type, own_or_rent, pets_permitted, experience,
    other_pets, daily_availability, reason, agreed_to_terms, message, status
) VALUES
(1, 4, 'Alice Smith', '555-0201', 'Cityville', '789 Adopter Ave', 'independent house', 'own', true, 'Raised dogs for 10 years', 'None currently', '4-6 hours', 'We have a big fenced yard and work from home.', true, 'I would love to adopt Buddy! We have a big yard.', 'pending'),
(2, 5, 'Bob Johnson', '555-0202', 'Cityville', '321 Pet Lover Rd', 'apartment', 'rent', true, 'Had cats growing up', '1 senior cat', '3-4 hours', 'Looking for a calm companion cat for our apartment.', true, 'Luna seems like a great fit for our apartment.', 'pending'),
(4, 6, 'Charlie Brown', '555-0203', 'Greenhill', '654 Home St', 'independent house', 'own', true, 'Volunteer at local shelter', 'None', '6+ hours', 'Love beagles and active outdoor lifestyle.', true, 'Bella is so cute and would love our hiking lifestyle!', 'pending');
