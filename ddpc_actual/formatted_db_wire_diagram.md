# MyDDPC Database Schema Documentation

## Table of Contents
- [User-Centric Tables](#user-centric-tables)
  - [users](#users)
  - [usermeta](#usermeta)
  - [user_garage](#user_garage)
  - [user_garage_maintenance](#user_garage_maintenance)
  - [user_garage_builds](#user_garage_builds)
  - [myddpc_saved_items](#myddpc_saved_items)
- [Application & Content Tables](#application--content-tables)
  - [vehicle_data](#vehicle_data)
  - [vehicle_images](#vehicle_images)
  - [vehicle_image_feedback](#vehicle_image_feedback)

## User-Centric Tables

### users
Core WordPress table storing fundamental user account data.

**Source Files:** `myddpc-user-system.php`

| Column | Type | Description |
|--------|------|-------------|
| ID | int | Primary key, unique user identifier |
| user_login | varchar | Username for login |
| user_pass | varchar | Hashed password |
| user_nicename | varchar | URL-friendly username |
| user_email | varchar | User's email address |
| display_name | varchar | Name displayed publicly |

### usermeta
Extended user profile data in key-value pairs.

**Source Files:** `myddpc-user-system.php`

| Column | Type | Description |
|--------|------|-------------|
| first_name | varchar | User's first name |
| last_name | varchar | User's last name |
| user_location | varchar | Geographical location |
| social_youtube | varchar | YouTube profile URL |
| social_instagram | varchar | Instagram profile URL |
| social_twitter | varchar | Twitter/X profile URL |
| social_tiktok | varchar | TikTok profile URL |
| has_public_profile | boolean | Profile visibility setting |

### user_garage
Links users to their vehicles.

**Source Files:** `myddpc-garage.php`, `vehicle-profile.php`, `myddpc-app.php`

| Column | Type | Description |
|--------|------|-------------|
| garage_id | int | Primary key |
| user_id | int | Foreign key to users.ID |
| year | int | Vehicle model year |
| make | varchar | Vehicle manufacturer |
| model | varchar | Vehicle model |
| trim | varchar | Trim level |
| nickname | varchar | Custom vehicle name |
| status | enum | Ownership status ('active', 'sold', 'in-op') |
| visibility | enum | Privacy setting ('public', 'private') |
| ownership_date | date | Date acquired |
| photo_url | varchar | URL to vehicle photo |

### user_garage_maintenance
Maintenance records for vehicles.

**Source Files:** `myddpc-garage.php`

| Column | Type | Description |
|--------|------|-------------|
| maint_id | int | Primary key |
| garage_id | int | Foreign key to user_garage |
| date_performed | date | Service date |
| mileage | int | Odometer reading |
| description | text | Service details |
| cost | decimal | Service cost |
| category | varchar | Service type (e.g., 'Engine', 'Brakes') |

### user_garage_builds
Vehicle modification records.

**Source Files:** `myddpc-garage.php`, `vehicle-profile.php`, `myddpc-app.php`

| Column | Type | Description |
|--------|------|-------------|
| build_id | int | Primary key |
| garage_id | int | Foreign key to user_garage |
| part_name | varchar | Name of part |
| part_brand | varchar | Manufacturer |
| category | varchar | Modification type |
| status | enum | Installation status |
| date_added | datetime | When added to build |
| installation_date | date | When installed |

### myddpc_saved_items
User's saved content.

**Source Files:** `myddpc-user-system.php`

| Column | Type | Description |
|--------|------|-------------|
| id | int | Primary key |
| user_id | int | Foreign key to users.ID |
| item_type | varchar | Type of saved item |
| item_title | varchar | Display title |
| item_data | text | Serialized item data |
| created_at | datetime | When saved |

## Application & Content Tables

### vehicle_data
Master vehicle specifications with data completeness percentages and usage information.

**Source Files:** `myddpc-car-lookup.php`, `myddpc-dimensions.php`, `myddpc-performance.php`, `myddpc-discover.php`

#### Core Identification (100% complete)
| Column | Type | Description |
|--------|------|-------------|
| Year | int | Model year |
| Make | varchar | Manufacturer |
| Model | varchar | Model name |
| Trim | varchar | Trim level |
| Platform_code | varchar | Platform/generation code |
| Country_of_origin | varchar | Manufacturing country |
| Body_type | varchar | Vehicle style (e.g., Sedan, SUV) |
| Car_classification | varchar | Vehicle class/category |

#### Engine & Power (98-99% complete)
| Column | Type | Description | Complete | Usage |
|--------|------|-------------|----------|-------|
| Engine_size | decimal | Displacement in liters | 98.45% | Display only |
| Cylinders | int | Number of engine cylinders | 98.45% | Display only |
| Cam_type | varchar | Engine camshaft type (e.g., DOHC, SOHC) | 81.25% | Display only |
| Valves | int | Total number of valves | 81.25% | Display only |
| Valve_timing | varchar | Valve timing system | 62.60% | Display only |
| Horsepower_HP | int | Peak engine power | 99.67% | Display, 0-60mph calc |
| Horsepower_rpm | int | RPM at peak horsepower | 96.78% | Display only |
| Torque_ft_lbs | int | Peak engine torque | 98.09% | Display, 0-60mph calc |
| Torque_rpm | int | RPM at peak torque | 96.02% | Display only |

#### Drivetrain (99-100% complete)
| Column | Type | Description | Complete | Usage |
|--------|------|-------------|----------|-------|
| Drive_type | varchar | Drivetrain type (FWD, RWD, AWD, 4WD) | 100% | Display only |
| Transmission | varchar | Transmission type | 99.29% | Display, 0-60mph calc |

#### Fuel & Efficiency - ICE/Hybrid (83-99% complete)
| Column | Type | Description | Complete | Usage |
|--------|------|-------------|----------|-------|
| Fuel_type | varchar | Fuel type (Gasoline, Diesel, etc.) | 99.98% | Display only |
| EPA_combined_MPG | decimal | Combined fuel efficiency | 83.16% | Display only |
| EPA_city_MPG | decimal | City fuel efficiency | 83.07% | Display only |
| EPA_hwy_MPG | decimal | Highway fuel efficiency | 83.07% | Display only |
| Range_city_mi | int | City driving range | 98.45% | Display only |
| Range_hwy_mi | int | Highway driving range | 98.45% | Display only |
| Fuel_tank_gal | decimal | Fuel tank capacity | 97.52% | Display only |

#### Electric Vehicle Specs (1-2% complete)
| Column | Type | Description | Complete | Usage |
|--------|------|-------------|----------|-------|
| EPA_combined_MPGe | decimal | Combined MPG equivalent | 2.28% | Display only |
| EPA_city_MPGe | decimal | City MPG equivalent | 2.13% | Display only |
| EPA_hwy_MPGe | decimal | Highway MPG equivalent | 2.13% | Display only |
| EPA_electric_range_mi | decimal | Electric-only range | 2.03% | Display only |
| EPA_kWh_100mi | decimal | Energy consumption | 1.88% | Display only |
| Battery_capacity_kWh | decimal | Battery size | 1.27% | Display only |
| Charge_time_240v_hr | decimal | 240V charging time | 1.96% | Display only |

#### Dimensions & Capacity (65-100% complete)
| Column | Type | Description | Complete | Usage |
|--------|------|-------------|----------|-------|
| Length_in | decimal | Overall length | 100% | Display only |
| Width_in | decimal | Overall width | 100% | Display only |
| Height_in | decimal | Overall height | 100% | Display only |
| Wheelbase_in | decimal | Distance between axles | 100% | Display only |
| Curb_weight_lbs | int | Weight without cargo | 89.73% | Display, 0-60mph calc |
| Doors | int | Number of doors | 100% | Display only |
| Seating | int | Passenger capacity | 82.74% | Display only |
| Cargo_cu_ft | decimal | Cargo volume | 65.91% | Display only |
| Towing_capacity_lbs | int | Maximum towing weight | 55.58% | Display only |
| Ground_clearance_in | decimal | Ground clearance | 64.82% | Display only |

#### Pricing (97-100% complete)
| Column | Type | Description | Complete | Usage |
|--------|------|-------------|----------|-------|
| MSRP | decimal | Manufacturer's suggested price | 100% | Display only |
| Invoice | decimal | Dealer invoice price | 97% | Display only |
| Used_price_range | varchar | Market price range | 98% | Display only |

### vehicle_images
Approved vehicle images.

**Source Files:** `myddpc-car-lookup.php`

| Column | Type | Description |
|--------|------|-------------|
| id | int | Primary key |
| year | int | Vehicle year |
| make | varchar | Vehicle make |
| model | varchar | Vehicle model |
| image_url | varchar | Image URL |
| is_shared | boolean | Public visibility |
| uploaded_by | int | User ID of uploader |
| uploaded_at | datetime | Upload timestamp |

### vehicle_image_feedback
User feedback on vehicle images.

**Source Files:** `myddpc-car-lookup.php`

| Column | Type | Description |
|--------|------|-------------|
| id | int | Primary key |
| year | int | Vehicle year |
| make | varchar | Vehicle make |
| model | varchar | Vehicle model |
| feedback_type | enum | Type of feedback |
| user_id | int | Submitter's user ID |
| user_ip | varchar | Submitter's IP |
| user_agent | text | Browser/OS info |
| submitted_at | datetime | Submission time |
| resolved | boolean | Resolution status |
