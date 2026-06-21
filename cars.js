const carsData = [
  {
    id: "lambo-aventador",
    name: "Aventador LP780-4 Ultimae",
    brand: "Lamborghini",
    price: 507000,
    year: 2023,
    fuel: "Gasoline",
    transmission: "Automatic",
    hp: 780,
    acceleration: "2.8s",
    topSpeed: "220 mph",
    engine: "6.5L V12",
    drivetrain: "AWD",
    description: "The Lamborghini Aventador LP 780-4 Ultimae is the final and most powerful expression of Lamborghini's legendary naturally aspirated V12 super sports car.",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80"
    ],
    angles: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "porsche-gt3rs",
    name: "911 GT3 RS (992)",
    brand: "Porsche",
    price: 223800,
    year: 2024,
    fuel: "Gasoline",
    transmission: "Automatic",
    hp: 518,
    acceleration: "3.0s",
    topSpeed: "184 mph",
    engine: "4.0L Flat-6",
    drivetrain: "RWD",
    description: "Athletic, raw, and built for the track. The 911 GT3 RS is designed for maximum aerodynamics and performance with its active rear wing and motorsport suspension.",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611245801725-275d8629cfb7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80"
    ],
    angles: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611245801725-275d8629cfb7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "merc-amggt",
    name: "AMG GT Black Series",
    brand: "Mercedes-Benz",
    price: 325000,
    year: 2023,
    fuel: "Gasoline",
    transmission: "Automatic",
    hp: 720,
    acceleration: "3.1s",
    topSpeed: "202 mph",
    engine: "4.0L V8 Twin-Turbo",
    drivetrain: "RWD",
    description: "The absolute pinnacle of Mercedes-AMG performance. The GT Black Series incorporates pure motorsport technology directly onto the road.",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"
    ],
    angles: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "tesla-models",
    name: "Model S Plaid",
    brand: "Tesla",
    price: 89990,
    year: 2024,
    fuel: "Electric",
    transmission: "Automatic",
    hp: 1020,
    acceleration: "1.99s",
    topSpeed: "200 mph",
    engine: "Tri-Motor Electric",
    drivetrain: "AWD",
    description: "The fastest accelerating car in production today. With over 1,020 horsepower and a luxurious, futuristic cockpit, the Model S Plaid redefines performance.",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"
    ],
    angles: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "ferrari-sf90",
    name: "SF90 Stradale Assetto Fiorano",
    brand: "Ferrari",
    price: 524000,
    year: 2024,
    fuel: "Hybrid",
    transmission: "Automatic",
    hp: 986,
    acceleration: "2.5s",
    topSpeed: "211 mph",
    engine: "4.0L V8 Plug-in Hybrid",
    drivetrain: "AWD",
    description: "Ferrari's first-ever production plug-in hybrid supercar. Blistering acceleration combined with a state-of-the-art torque-vectoring all-wheel-drive system.",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605558202138-0c7f688f4806?auto=format&fit=crop&w=1200&q=80"
    ],
    angles: [
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605558202138-0c7f688f4806?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "bmw-m4comp",
    name: "M4 Competition xDrive",
    brand: "BMW",
    price: 86300,
    year: 2024,
    fuel: "Gasoline",
    transmission: "Automatic",
    hp: 503,
    acceleration: "3.4s",
    topSpeed: "180 mph",
    engine: "3.0L TwinPower Turbo Inline-6",
    drivetrain: "AWD",
    description: "The M4 Competition Coupe offers high-performance precision, an aggressive kidney grille, and state-of-the-art driving dynamics.",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80"
    ],
    angles: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "audi-r8v10",
    name: "R8 V10 Performance LMX",
    brand: "Audi",
    price: 209000,
    year: 2023,
    fuel: "Gasoline",
    transmission: "Automatic",
    hp: 602,
    acceleration: "3.2s",
    topSpeed: "205 mph",
    engine: "5.2L Naturally Aspirated V10",
    drivetrain: "AWD",
    description: "The roar of a legendary V10 engine located right behind your head. The Audi R8 represents supercar performance built with daily driveability.",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611245801725-275d8629cfb7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ],
    angles: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611245801725-275d8629cfb7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "rolls-ghost",
    name: "Ghost Black Badge",
    brand: "Rolls-Royce",
    price: 393500,
    year: 2024,
    fuel: "Gasoline",
    transmission: "Automatic",
    hp: 591,
    acceleration: "4.5s",
    topSpeed: "155 mph",
    engine: "6.75L Twin-Turbo V12",
    drivetrain: "AWD",
    description: "Whisper-quiet luxury meets dark design aesthetics. The Black Badge version of the Ghost features elevated torque and an imposing, custom presence.",
    image: "https://images.unsplash.com/photo-1632245889027-e406faaa19ca?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1632245889027-e406faaa19ca?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=1200&q=80"
    ],
    angles: [
      "https://images.unsplash.com/photo-1632245889027-e406faaa19ca?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1632245889027-e406faaa19ca?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80"
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = carsData;
}
