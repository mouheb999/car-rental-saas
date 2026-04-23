export interface Car {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  seats: number;
  transmission: "Manuelle" | "Automatique";
  fuel: "Essence" | "Diesel" | "Hybride" | "Électrique";
  horsepower: number;
  year: number;
  category: string;
  description: string;
  gallery: string[];
}

const IBIZA = "https://catalogue.automobile.tn/big/2025/02/47324.webp?t=1";
const CLIO = "https://catalogue.automobile.tn/big/2026/01/47555.webp?t=1";
const SWIFT = "https://catalogue.automobile.tn/big/2025/02/47300.webp?t=1";
const FABIA = "https://catalogue.automobile.tn/big/2024/02/47102.webp?t=1";
const POLO = "https://catalogue.automobile.tn/big/2023/03/46892.webp?t=1";
const I20 =
  "https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/i20/11092/1755774177956/front-left-side-47.jpg";

export const cars: Car[] = [
  {
    id: "seat-ibiza",
    name: "Seat Ibiza",
    brand: "Seat",
    image: IBIZA,
    price: 140,
    seats: 5,
    transmission: "Manuelle",
    fuel: "Essence",
    horsepower: 110,
    year: 2024,
    category: "Citadine",
    description:
      "Design affirmé et conduite agile. La Seat Ibiza est la compagne idéale pour la ville comme pour l'autoroute.",
    gallery: [IBIZA, POLO, FABIA],
  },
  {
    id: "renault-clio-5",
    name: "Renault Clio 5",
    brand: "Renault",
    image: CLIO,
    price: 130,
    seats: 5,
    transmission: "Manuelle",
    fuel: "Diesel",
    horsepower: 100,
    year: 2024,
    category: "Citadine",
    description:
      "Raffinée, économique et confortable. La Clio 5 allie le style français à une consommation maîtrisée.",
    gallery: [CLIO, IBIZA, SWIFT],
  },
  {
    id: "suzuki-swift",
    name: "Suzuki Swift",
    brand: "Suzuki",
    image: SWIFT,
    price: 120,
    seats: 5,
    transmission: "Manuelle",
    fuel: "Essence",
    horsepower: 83,
    year: 2024,
    category: "Citadine",
    description:
      "Maniable et économique. La Swift concentre du caractère dans un format idéal pour la ville.",
    gallery: [SWIFT, I20, IBIZA],
  },
  {
    id: "skoda-fabia",
    name: "Skoda Fabia",
    brand: "Skoda",
    image: FABIA,
    price: 135,
    seats: 5,
    transmission: "Automatique",
    fuel: "Essence",
    horsepower: 95,
    year: 2024,
    category: "Compacte",
    description:
      "Spacieuse, bien finie et surprenante. La Fabia offre un habitacle généreux et un comportement très sûr.",
    gallery: [FABIA, POLO, CLIO],
  },
  {
    id: "hyundai-i20",
    name: "Hyundai i20",
    brand: "Hyundai",
    image: I20,
    price: 125,
    seats: 5,
    transmission: "Manuelle",
    fuel: "Essence",
    horsepower: 100,
    year: 2024,
    category: "Citadine",
    description:
      "Technologique et facile à vivre. La i20 offre confort, sécurité et un look moderne dans un format compact.",
    gallery: [I20, SWIFT, CLIO],
  },
  {
    id: "volkswagen-polo",
    name: "Volkswagen Polo",
    brand: "Volkswagen",
    image: POLO,
    price: 150,
    seats: 5,
    transmission: "Automatique",
    fuel: "Essence",
    horsepower: 110,
    year: 2024,
    category: "Compacte",
    description:
      "Le savoir-faire allemand en format compact. La Polo propose une conduite sereine et une finition soignée.",
    gallery: [POLO, FABIA, IBIZA],
  },
];

export const brands = [
  { name: "Volkswagen", logo: "VW" },
  { name: "Seat", logo: "SEAT" },
  { name: "Renault", logo: "RENAULT" },
  { name: "Skoda", logo: "ŠKODA" },
  { name: "Hyundai", logo: "HYUNDAI" },
  { name: "Suzuki", logo: "SUZUKI" },
  { name: "Peugeot", logo: "PEUGEOT" },
  { name: "Kia", logo: "KIA" },
  { name: "Toyota", logo: "TOYOTA" },
  { name: "Dacia", logo: "DACIA" },
];

export const testimonials = [
  {
    id: 1,
    name: "Mohamed Ben Salah",
    role: "Client, Tunis",
    text: "Service très professionnel, voiture propre et livraison rapide à l'aéroport. Je recommande vivement ALIA GO.",
    rating: 5,
  },
  {
    id: 2,
    name: "Amira Trabelsi",
    role: "Cliente, Sousse",
    text: "Réservation facile et sans complications. L'équipe est à l'écoute et la voiture était en parfait état.",
    rating: 5,
  },
  {
    id: 3,
    name: "Youssef Khelifi",
    role: "Client, Sfax",
    text: "Rapport qualité-prix imbattable en Tunisie. J'ai loué plusieurs fois, toujours la même satisfaction.",
    rating: 5,
  },
];

export const categories = ["Tout", "Citadine", "Compacte", "Berline", "SUV"];
