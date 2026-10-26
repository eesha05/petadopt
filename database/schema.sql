CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('adopter', 'shelter', 'admin')),
    phone VARCHAR(50),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shelters (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    shelter_id INTEGER NOT NULL REFERENCES shelters(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    species VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    age INTEGER,
    gender VARCHAR(50),
    size VARCHAR(50),
    location TEXT,
    description TEXT,
    health_info TEXT,
    vaccination_status VARCHAR(100),
    sterilized BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'pending', 'adopted', 'unavailable')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE adoption_requests (
    id SERIAL PRIMARY KEY,
    pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    adopter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    city VARCHAR(100),
    address TEXT,
    housing_type VARCHAR(50),
    own_or_rent VARCHAR(20),
    pets_permitted BOOLEAN DEFAULT TRUE,
    experience TEXT,
    other_pets TEXT,
    daily_availability VARCHAR(100),
    reason TEXT,
    agreed_to_terms BOOLEAN DEFAULT TRUE,
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_active_request UNIQUE (pet_id, adopter_id)
);

CREATE TABLE wishlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_pet_wishlist UNIQUE (user_id, pet_id)
);
