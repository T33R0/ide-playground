MyDDPC Comprehensive Database Index
This document provides a complete and detailed index of all database tables and their respective variables (columns) as identified across all provided PHP tool files. It is intended to serve as the single source of truth for backend development and frontend data integration.

1. User-Centric Tables
These tables are focused on storing information directly related to users, their profiles, their vehicles, and their interactions with the platform.

Table: users (Core WordPress)
Purpose: The standard WordPress table that stores fundamental user account data. This is the master record for user identity.

Source Files: myddpc-user-system.php

Variable

Purpose

ID

The unique numerical identifier for each user. Serves as the primary key and is used as a foreign key in all other user-related tables.

user_login

The user's login name (username).

user_pass

The user's hashed password for authentication.

user_nicename

A URL-friendly version of the username, often used in permalinks.

user_email

The user's email address, used for login, notifications, and password resets.

display_name

The name to be displayed publicly on profiles and community interactions.

Table: usermeta (Core WordPress)
Purpose: The standard WordPress table for storing additional, custom user profile data and settings as key-value pairs. Your tools extend this to store profile-specific information.

Source Files: myddpc-user-system.php

Variable

Purpose

first_name

The user's first name.

last_name

The user's last name.

user_location

The geographical location provided by the user for their profile.

social_youtube

The full URL to the user's YouTube profile or channel.

social_instagram

The full URL to the user's Instagram profile.

social_twitter

The full URL to the user's Twitter/X profile.

social_tiktok

The full URL to the user's TikTok profile.

has_public_profile

A flag (true/false) to control the global visibility of the user's profile page.

Table: user_garage
Purpose: This is the central "Garage" table. It creates the critical link between a registered user and the specific vehicles they own, forming the foundation of all user-specific vehicle data.

Source Files: myddpc-garage.php, vehicle-profile.php, myddpc-app.php

Variable

Purpose

garage_id

The primary key for this specific user-vehicle relationship entry.

user_id

Foreign key linking to the user's ID in the users table.

year

The manufacturing year of the vehicle (e.g., 1999).

make

The manufacturer of the vehicle (e.g., "BMW").

model

The model of the vehicle (e.g., "Z3 Coupe").

trim

The specific trim level or sub-model of the vehicle.

nickname

A custom, user-defined name for the vehicle (e.g., "The Track Rat").

status

The current ownership status of the vehicle (e.g., 'active', 'sold', 'in-op').

visibility

The privacy setting for this specific vehicle's profile (e.g., 'public', 'private').

ownership_date

The date the user acquired the vehicle.

photo_url

The URL to the primary, user-uploaded photo for this vehicle.

Table: user_garage_maintenance
Purpose: Stores all the maintenance logs entered by a user for a specific vehicle in their garage. This powers the "Digital Maintenance Records" feature.

Source Files: myddpc-garage.php

Variable

Purpose

maint_id

The primary key for the maintenance log entry.

garage_id

Foreign key linking to a specific vehicle in the user_garage table.

date_performed

The date the maintenance work was completed.

mileage

The vehicle's odometer reading at the time of service.

description

A detailed text description of the work performed, parts used, and any relevant notes.

cost

The total monetary cost of the parts and/or labor for the service.

category

The type of maintenance performed, used for filtering and organization (e.g., 'Engine', 'Brakes', 'Fluids').

Table: user_garage_builds
Purpose: Stores the specific modifications a user has made or is planning for their vehicle. This is the core of the "Build Plans" feature for the Builder tier.

Source Files: myddpc-garage.php, vehicle-profile.php, myddpc-app.php

Variable

Purpose

build_id

The primary key for the modification entry.

garage_id

Foreign key linking to a specific vehicle in the user_garage table.

part_name

The name of the installed or planned part (e.g., "TC Kline SA Coilovers").

part_brand

The brand or manufacturer of the part (e.g., "TC Kline").

category

The area of the car the modification applies to (e.g., 'Suspension', 'Wheels/Tires').

status

The current status of the modification (e.g., 'Installed', 'Planned').

date_added

The date the user added this item to their build plan.

installation_date

The date the modification was actually installed on the vehicle.

Table: myddpc_saved_items
Purpose: A generic table for users to save various items from across the site, such as interesting vehicles from the "Discover" tool or specific parts.

Source Files: myddpc-user-system.php

Variable

Purpose

id

The primary key for the saved item entry.

user_id

Foreign key linking to the user's ID in the users table.

item_type

A string identifying the type of item saved (e.g., 'vehicle', 'part', 'article').

item_title

A human-readable title for the saved item.

item_data

A serialized or JSON-encoded string containing the specific data of the saved item (e.g., year/make/model for a vehicle).

created_at

The timestamp of when the item was saved by the user.

2. Application & Content Tables
These tables store master data for lookups, user-generated content for moderation, and other application-wide information.

Table: vehicle_data (prefixed qfh_vehicle_data)
Purpose: The master vehicle specification database. It is the comprehensive, read-only source of truth for all vehicle lookups, comparisons, and discovery tools.

Source Files: myddpc-car-lookup.php, myddpc-dimensions.php, myddpc-performance.php, myddpc-discover.php

Variable

Purpose

Core Identifiers



Year, Make, Model, Trim

The four key fields that uniquely identify a specific vehicle variant.

Body type

The style of the vehicle (e.g., 'Sedan', 'Coupe', 'SUV').

Pricing



Base MSRP, Base Invoice

Original manufacturer's suggested retail and invoice pricing.

Used price range

A text field describing the typical market price range for a used model.

Performance Metrics



Horsepower (HP), Horsepower (rpm)

The peak horsepower output and the engine speed at which it occurs.

Torque (ft-lbs), Torque (rpm)

The peak torque output and the engine speed at which it occurs.

Engine size (l)

The displacement of the engine in liters.

Valves

The total number of valves in the engine.

Drag coefficient (Cd)

A measure of the vehicle's aerodynamic resistance.

Dimensions & Weight



Length (in), Width (in), Height (in)

Overall exterior dimensions of the vehicle.

Wheelbase (in)

The distance between the centers of the front and rear wheels.

Front track (in), Rear track (in)

The distance between the centerlines of the wheels on the same axle.

Ground clearance (in)

The distance between the lowest point of the vehicle and the ground.

Turning circle (ft)

The diameter of the smallest circle the vehicle can make when turning.

Angle of approach (degrees)

The maximum angle of a ramp the vehicle can ascend without the front bumper making contact.

Angle of departure (degrees)

The maximum angle of a ramp the vehicle can descend without the rear bumper making contact.

Curb weight (lbs), Gross weight (lbs)

The weight of the vehicle without occupants/cargo, and the maximum safe operating weight.

Interior & Capacity



Doors, Total seating

The number of doors and the maximum passenger capacity.

Front/Rear head/hip/leg/shoulder room (in)

A full suite of interior measurement specifications.

EPA interior volume (cu ft)

The total passenger cabin volume as defined by the EPA.

Cargo capacity (cu ft), Maximum cargo capacity (cu ft)

The volume of the trunk/cargo area with seats up and with seats down.

Maximum payload (lbs), Maximum towing capacity (lbs)

The maximum weight of cargo/passengers and the maximum weight the vehicle can tow.

Efficiency (Gas & Electric)



Fuel tank capacity (gal)

The total volume of the fuel tank.

EPA combined MPG

The EPA-estimated combined city/highway fuel economy for gasoline vehicles.

EPA combined MPGe

The EPA-estimated combined efficiency for electric or hybrid vehicles, in miles per gallon equivalent.

EPA electricity range (mi)

The EPA-estimated maximum range on a full charge for an electric vehicle.

EPA kWh/100 mi

The EPA-estimated electricity consumption per 100 miles for an EV.

EPA time to charge battery (at 240V) (hr)

The estimated time to fully charge the battery using a Level 2 charger.

Battery capacity (kWh)

The total energy capacity of the high-voltage battery in an EV or hybrid.

Ratings & Metadata



Scorecard Driving, Confort, Interior, Utility, Technology

Internal or third-party rating scores for various aspects of the vehicle.

Date added

The date the record was added to this master database.

Table: vehicle_images
Purpose: Stores curated and approved image URLs for vehicles to ensure consistent, high-quality visuals in lookup and profile tools.

Source Files: myddpc-car-lookup.php

Variable

Purpose

year, make, model

The identifiers for the vehicle the image represents.

image_url

The direct URL or path to the hosted image file.

is_shared

A flag (1 or 0) indicating if the image is approved for public, site-wide use.

uploaded_by

The user_id of the user or admin who submitted the image.

uploaded_at

The timestamp of when the image was uploaded.

Table: vehicle_image_feedback
Purpose: Collects, stores, and tracks user-submitted feedback regarding incorrect or missing vehicle images, creating a workflow for administrative review and correction.

Source Files: myddpc-car-lookup.php

Variable

Purpose

id

The primary key for the feedback entry.

year, make, model

The identifiers for the vehicle the feedback pertains to.

feedback_type

The type of report submitted by the user (e.g., 'wrong_image' or 'no_image').

user_id

The ID of the logged-in user who submitted the feedback (can be null).

user_ip

The IP address of the user who submitted the feedback, for rate-limiting and tracking.

user_agent

The browser and OS information of the submitting user, for debugging.

submitted_at

The timestamp of when the feedback was submitted.

resolved

A boolean flag (1 or 0) for admins to track whether the feedback has been addressed.

