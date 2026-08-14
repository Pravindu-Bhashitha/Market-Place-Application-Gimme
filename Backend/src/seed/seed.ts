import { db } from "../config/db";
import { Condition, NewListingInput } from "../types/listing.types";

const sample: NewListingInput[] = [
  { title: "MacBook Air M2 13\"", category: "Electronics", price: 899, condition: "like-new", description: "Barely used, comes with original box and charger. Battery health 98%.", imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9" },
  { title: "Sony WH-1000XM4 Headphones", category: "Electronics", price: 180, condition: "good", description: "Great noise cancelling, minor scuff on the left ear cup.", imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90" },
  { title: "iPad 9th Gen 64GB", category: "Electronics", price: 220, condition: "good", description: "Includes case and screen protector. Small scratch on the back.", imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0" },
  { title: "Canon EOS M50 Camera", category: "Electronics", price: 430, condition: "like-new", description: "Shutter count under 2000. Comes with 15-45mm kit lens.", imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32" },
  { title: "Mechanical Keyboard (Hot-swap)", category: "Electronics", price: 65, condition: "new", description: "Never used, still sealed. Brown switches, RGB backlight.", imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3" },
  { title: "Mid-Century Wood Bookshelf", category: "Furniture", price: 140, condition: "good", description: "Solid oak, 5 shelves. Minor wear on the base, very sturdy.", imageUrl: "https://images.unsplash.com/photo-1594620302200-9a762244a156" },
  { title: "Grey Fabric Sofa (3-seater)", category: "Furniture", price: 350, condition: "fair", description: "Comfortable but shows some fading. Pet-free, smoke-free home.", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc" },
  { title: "Standing Desk (Electric)", category: "Furniture", price: 210, condition: "like-new", description: "Dual motor, memory presets. Used for 3 months only.", imageUrl: "https://images.unsplash.com/photo-1519974719765-e6559eac2575" },
  { title: "Ergonomic Office Chair", category: "Furniture", price: 95, condition: "good", description: "Adjustable lumbar support and armrests. Small tear on the mesh.", imageUrl: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8" },
  { title: "Round Dining Table (4-seat)", category: "Furniture", price: 175, condition: "good", description: "Solid wood top, minor scratches consistent with normal use.", imageUrl: "https://images.unsplash.com/photo-1617806118233-18e1de247200" },
  { title: "Vintage Leather Jacket", category: "Clothing", price: 75, condition: "good", description: "Genuine leather, size M. A couple of small creases from storage.", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5" },
  { title: "Winter Down Parka (L)", category: "Clothing", price: 60, condition: "like-new", description: "Worn twice, extremely warm. No stains or damage.", imageUrl: "https://images.unsplash.com/photo-1544923246-77307dd654cb" },
  { title: "Running Shoes - Size 10", category: "Clothing", price: 35, condition: "good", description: "Light wear on the outsole, plenty of life left.", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff" },
  { title: "Wool Overcoat (Navy, M)", category: "Clothing", price: 90, condition: "like-new", description: "Tailored fit, dry-cleaned before listing.", imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3" },
  { title: "Designer Sunglasses", category: "Clothing", price: 40, condition: "good", description: "Comes with original case. Small scratch on one lens, doesn't affect vision.", imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f" },
  { title: "The Pragmatic Programmer (Book)", category: "Books", price: 15, condition: "good", description: "20th anniversary edition, some highlighting in chapter 3.", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c" },
  { title: "Sapiens by Yuval Noah Harari", category: "Books", price: 10, condition: "like-new", description: "Read once, no markings, cover in great shape.", imageUrl: "https://images.unsplash.com/photo-1592496001020-d31bd830651f" },
  { title: "Full Harry Potter Box Set", category: "Books", price: 45, condition: "good", description: "All 7 books, softcover, light shelf wear on spines.", imageUrl: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76" },
  { title: "Atomic Habits by James Clear", category: "Books", price: 12, condition: "new", description: "Brand new, bought as a gift but ended up with two.", imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794" },
  { title: "Cookbook: Salt Fat Acid Heat", category: "Books", price: 14, condition: "good", description: "A few pages have flour smudges, fully readable.", imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646" },
  { title: "Trek Mountain Bike 29\"", category: "Sports & Outdoors", price: 320, condition: "good", description: "Hydraulic disc brakes, recently tuned. Some frame scuffs.", imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e" },
  { title: "4-Person Camping Tent", category: "Sports & Outdoors", price: 85, condition: "like-new", description: "Used on one trip. Waterproof, easy setup, all stakes included.", imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4" },
  { title: "Yoga Mat + Block Set", category: "Sports & Outdoors", price: 18, condition: "new", description: "Unused, still in packaging.", imageUrl: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2" },
  { title: "Adjustable Dumbbell Set", category: "Sports & Outdoors", price: 140, condition: "good", description: "5-25kg per side, minor rust on one handle, fully functional.", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438" },
  { title: "Inflatable Kayak (2-person)", category: "Sports & Outdoors", price: 160, condition: "fair", description: "Small patch repair on one side, holds air well, includes pump.", imageUrl: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51" },
  { title: "Cast Iron Skillet Set", category: "Home & Garden", price: 40, condition: "good", description: "Seasoned and ready to use, two sizes included.", imageUrl: "https://images.unsplash.com/photo-1584990347449-a2d4c4d8c6e4" },
  { title: "Indoor Plant Bundle (3 pots)", category: "Home & Garden", price: 25, condition: "new", description: "Healthy pothos, snake plant, and succulent, with ceramic pots.", imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735" },
  { title: "Robot Vacuum Cleaner", category: "Home & Garden", price: 110, condition: "like-new", description: "Used for 2 months, works perfectly, app-connected.", imageUrl: "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9" },
  { title: "LEGO Architecture Skyline Set", category: "Toys & Games", price: 30, condition: "new", description: "Sealed box, never opened.", imageUrl: "https://images.unsplash.com/photo-1518331483807-f6adb0e1ad03" },
  { title: "Nintendo Switch OLED + 2 Games", category: "Toys & Games", price: 240, condition: "good", description: "Includes Mario Kart 8 and Zelda: TOTK. Minor dock scratches.", imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7" },
  { title: "Mountain Trail Electric Scooter", category: "Vehicles", price: 380, condition: "good", description: "35km range, recently serviced brakes, minor cosmetic wear.", imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7" },
];

function seed() {
  const insert = db.prepare(
    `INSERT INTO listings (title, category, price, condition, description, imageUrl, createdAt)
     VALUES (@title, @category, @price, @condition, @description, @imageUrl, @createdAt)`
  );

  const clear = db.prepare("DELETE FROM listings");
  const resetSeq = db.prepare("DELETE FROM sqlite_sequence WHERE name = 'listings'");

  const run = db.transaction((items: NewListingInput[]) => {
    clear.run();
    resetSeq.run();
    const now = Date.now();
    items.forEach((item, index) => {
      // Spread createdAt over the past several days so date sorting has something to show.
      const createdAt = new Date(now - (items.length - index) * 1000 * 60 * 60 * 20).toISOString();
      insert.run({
        ...item,
        condition: item.condition as Condition,
        imageUrl: item.imageUrl ?? null,
        createdAt,
      });
    });
  });

  run(sample);
  console.log(`Seeded ${sample.length} listings into the database.`);
}

seed();