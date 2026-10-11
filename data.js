/* Bounce Back — content library. All recipes and routines are original, written for this app.
   Protein numbers are estimates: brands, swaps and portions change them. */

// id: [name, aisle, food groups used for "foods I skip"]
const ING = {
  chicken: ['Chicken breast', 'Meat & Seafood', ['poultry']],
  cannedchicken: ['Canned chicken', 'Pantry', ['poultry']],
  groundturkey: ['Lean ground turkey', 'Meat & Seafood', ['poultry']],
  turkeysausage: ['Turkey sausage', 'Meat & Seafood', ['poultry']],
  deliturkey: ['Deli turkey', 'Meat & Seafood', ['poultry']],
  leanbeef: ['Lean beef (sirloin or 93% ground)', 'Meat & Seafood', ['redmeat']],
  salmon: ['Salmon fillets', 'Meat & Seafood', ['fish']],
  tuna: ['Canned tuna', 'Pantry', ['fish']],
  shrimp: ['Shrimp (frozen, peeled)', 'Frozen', ['shellfish']],
  eggs: ['Eggs', 'Dairy & Eggs', ['eggs']],
  eggwhites: ['Liquid egg whites', 'Dairy & Eggs', ['eggs']],
  greekyogurt: ['Plain Greek yogurt', 'Dairy & Eggs', ['dairy']],
  cottage: ['Cottage cheese', 'Dairy & Eggs', ['dairy']],
  cheese: ['Shredded cheese', 'Dairy & Eggs', ['dairy']],
  feta: ['Feta', 'Dairy & Eggs', ['dairy']],
  milk: ['Milk (any kind)', 'Dairy & Eggs', []],
  stringcheese: ['String cheese', 'Dairy & Eggs', ['dairy']],
  tofu: ['Extra-firm tofu', 'Produce', ['soy']],
  edamame: ['Edamame (frozen)', 'Frozen', ['soy']],
  proteinpowder: ['Protein powder', 'Pantry', []],
  blackbeans: ['Black beans (canned)', 'Pantry', []],
  chickpeas: ['Chickpeas (canned)', 'Pantry', []],
  lentils: ['Dry lentils', 'Pantry', []],
  oats: ['Rolled oats', 'Pantry', []],
  rice: ['Rice (brown or white)', 'Pantry', []],
  quinoa: ['Quinoa', 'Pantry', []],
  pasta: ['Whole-wheat or protein pasta', 'Pantry', ['gluten']],
  tortillas: ['Whole-wheat tortillas', 'Bakery', ['gluten']],
  bread: ['Whole-grain bread', 'Bakery', ['gluten']],
  chia: ['Chia seeds', 'Pantry', []],
  pb: ['Peanut butter', 'Pantry', ['nuts']],
  almonds: ['Almonds', 'Pantry', ['nuts']],
  salsa: ['Salsa', 'Pantry', []],
  marinara: ['Marinara sauce', 'Pantry', []],
  tacoseasoning: ['Taco seasoning', 'Pantry', []],
  soysauce: ['Soy sauce', 'Pantry', ['soy']],
  broth: ['Chicken or veggie broth', 'Pantry', []],
  cannedtomatoes: ['Diced tomatoes (canned)', 'Pantry', []],
  honey: ['Honey', 'Pantry', []],
  ranchmix: ['Ranch seasoning', 'Pantry', []],
  hummus: ['Hummus', 'Produce', []],
  sweetpotato: ['Sweet potatoes', 'Produce', []],
  potatoes: ['Baby potatoes', 'Produce', []],
  spinach: ['Spinach', 'Produce', []],
  lettuce: ['Romaine or butter lettuce', 'Produce', []],
  broccoli: ['Broccoli', 'Produce', []],
  peppers: ['Bell peppers', 'Produce', []],
  onion: ['Onion', 'Produce', []],
  tomatoes: ['Tomatoes', 'Produce', []],
  cucumber: ['Cucumber', 'Produce', []],
  zucchini: ['Zucchini', 'Produce', []],
  carrots: ['Carrots', 'Produce', []],
  coleslaw: ['Coleslaw mix', 'Produce', []],
  avocado: ['Avocado', 'Produce', []],
  berries: ['Berries (fresh or frozen)', 'Produce', []],
  banana: ['Bananas', 'Produce', []],
  apple: ['Apples', 'Produce', []],
  lemon: ['Lemon', 'Produce', []],
  garlic: ['Garlic', 'Produce', []],
  frozenveg: ['Stir-fry veggies (frozen)', 'Frozen', []],
  coffee: ['Coffee', 'Pantry', []]
};
const AISLES = ['Produce', 'Meat & Seafood', 'Dairy & Eggs', 'Bakery', 'Pantry', 'Frozen', 'Other'];
const SKIP_GROUPS = [['fish', 'Fish'], ['shellfish', 'Shellfish'], ['redmeat', 'Red meat'], ['poultry', 'Poultry'],
  ['dairy', 'Dairy'], ['eggs', 'Eggs'], ['nuts', 'Nuts'], ['soy', 'Soy'], ['gluten', 'Gluten']];

// meal: b breakfast, l lunch, d dinner, s snack.  tags: quick, batch, nocook, family, veg
const RECIPES = [
  { id: 'r1', n: 'Berry yogurt bowl', meal: 'b', min: 5, p: 25, tags: ['quick', 'nocook', 'veg'], ing: ['greekyogurt', 'berries', 'chia', 'oats', 'honey'],
    how: ['Scoop about 1 cup of yogurt into a bowl.', 'Top with a handful of berries, a spoon of chia and a small handful of oats.', 'Drizzle a little honey if you like it sweeter.'] },
  { id: 'r2', n: 'Veggie egg scramble', meal: 'b', min: 10, p: 30, tags: ['quick', 'veg'], ing: ['eggs', 'eggwhites', 'spinach', 'peppers', 'cheese', 'bread'],
    how: ['Soften chopped peppers in a pan for 2 minutes, then add a big handful of spinach.', 'Pour in 2 eggs whisked with a splash of egg whites. Stir gently until just set.', 'Sprinkle with cheese and eat with a slice of toast.'] },
  { id: 'r3', n: 'Overnight protein oats', meal: 'b', min: 5, p: 30, tags: ['batch', 'nocook', 'veg'], ing: ['oats', 'proteinpowder', 'milk', 'chia', 'berries'],
    how: ['In a jar: ½ cup oats, 1 scoop protein powder, 1 spoon chia, about ¾ cup milk.', 'Shake, then refrigerate overnight.', 'Top with berries in the morning. Make 3 jars at once — they keep 3 days.'] },
  { id: 'r4', n: 'Cottage cheese toast', meal: 'b', min: 5, p: 22, tags: ['quick', 'nocook', 'veg'], ing: ['bread', 'cottage', 'tomatoes', 'avocado'],
    how: ['Toast 2 slices of bread.', 'Spread each with cottage cheese.', 'Top with sliced tomato or avocado, salt and pepper.'] },
  { id: 'r5', n: 'Egg muffin cups', meal: 'b', min: 25, p: 24, tags: ['batch', 'family'], ing: ['eggs', 'turkeysausage', 'peppers', 'cheese'],
    how: ['Heat oven to 375°F and grease a muffin tin.', 'Divide cooked crumbled sausage and diced peppers between 12 cups. Whisk 10 eggs and pour over. Top with cheese.', 'Bake about 18 minutes. Three cups is a serving. Refrigerate up to 4 days or freeze.'] },
  { id: 'r6', n: 'Coffee protein shake', meal: 'b', min: 3, p: 28, tags: ['quick', 'nocook', 'veg'], ing: ['coffee', 'proteinpowder', 'milk', 'banana'],
    how: ['Blend 1 cup cold coffee, 1 scoop vanilla or chocolate protein, a splash of milk and half a frozen banana.', 'Add ice and blend again.'] },
  { id: 'r7', n: 'Chicken taco bowl', meal: 'l', min: 15, p: 40, tags: ['quick', 'family'], ing: ['chicken', 'rice', 'blackbeans', 'salsa', 'lettuce', 'avocado', 'tacoseasoning'],
    how: ['Season sliced chicken with taco seasoning and cook in a hot pan 6–8 minutes (or use leftover chicken).', 'Build a bowl: rice, beans, chicken, shredded lettuce.', 'Top with salsa and avocado.'] },
  { id: 'r8', n: 'Crunchy tuna wrap', meal: 'l', min: 8, p: 32, tags: ['quick', 'nocook'], ing: ['tuna', 'greekyogurt', 'cucumber', 'carrots', 'tortillas', 'lettuce'],
    how: ['Mix a can of drained tuna with 2 spoons of Greek yogurt, diced cucumber and shredded carrot.', 'Season with salt, pepper and a squeeze of lemon if you have it.', 'Wrap in a tortilla with lettuce.'] },
  { id: 'r9', n: 'Turkey & hummus wrap', meal: 'l', min: 5, p: 28, tags: ['quick', 'nocook'], ing: ['deliturkey', 'hummus', 'tortillas', 'spinach', 'cucumber'],
    how: ['Spread hummus over a tortilla.', 'Layer on 4–5 slices of turkey, spinach and cucumber.', 'Roll up tight and slice in half.'] },
  { id: 'r10', n: 'Greek chickpea bowl', meal: 'l', min: 15, p: 22, tags: ['batch', 'veg'], ing: ['chickpeas', 'quinoa', 'cucumber', 'tomatoes', 'feta', 'lemon'],
    how: ['Cook quinoa (or use leftover).', 'Toss with rinsed chickpeas, chopped cucumber and tomato.', 'Finish with feta, lemon juice, olive oil, salt and pepper. Keeps 3 days.'] },
  { id: 'r11', n: 'Chicken salad lettuce cups', meal: 'l', min: 8, p: 30, tags: ['quick', 'nocook'], ing: ['cannedchicken', 'greekyogurt', 'apple', 'almonds', 'lettuce'],
    how: ['Mix drained chicken with Greek yogurt, diced apple and chopped almonds.', 'Season with salt and pepper.', 'Spoon into lettuce leaves.'] },
  { id: 'r12', n: 'Sheet-pan chicken & veggies', meal: 'd', min: 30, p: 40, tags: ['batch', 'family'], ing: ['chicken', 'broccoli', 'sweetpotato', 'peppers'],
    how: ['Heat oven to 425°F. Cube sweet potato small; cut chicken, broccoli and peppers into bite-size pieces.', 'Toss everything with olive oil, salt, pepper and garlic powder on one pan.', 'Roast 20–25 minutes until the chicken reaches 165°F. Cook extra — tomorrow\'s lunch is done.'] },
  { id: 'r13', n: 'Turkey taco skillet', meal: 'd', min: 20, p: 35, tags: ['quick', 'family', 'batch'], ing: ['groundturkey', 'blackbeans', 'peppers', 'onion', 'salsa', 'tacoseasoning', 'cheese'],
    how: ['Brown the turkey with diced onion and pepper.', 'Stir in taco seasoning, rinsed beans and half a jar of salsa. Simmer 5 minutes.', 'Top with cheese. Serve in tortillas, over rice, or on lettuce — everyone builds their own.'] },
  { id: 'r14', n: 'Salmon, potatoes & broccoli', meal: 'd', min: 25, p: 34, tags: ['family'], ing: ['salmon', 'potatoes', 'broccoli', 'lemon'],
    how: ['Heat oven to 425°F. Roast halved baby potatoes with oil and salt for 10 minutes.', 'Add broccoli and salmon fillets to the pan. Season and add lemon slices.', 'Roast 12–14 more minutes until the salmon flakes.'] },
  { id: 'r15', n: 'Beef & broccoli stir-fry', meal: 'd', min: 20, p: 35, tags: ['quick', 'family'], ing: ['leanbeef', 'broccoli', 'soysauce', 'garlic', 'rice'],
    how: ['Start the rice.', 'Sear thin-sliced beef in a hot pan 2–3 minutes; set aside.', 'Cook broccoli with a splash of water until bright green, add garlic, soy sauce and the beef. Serve over rice.'] },
  { id: 'r16', n: 'Slow-cooker salsa chicken', meal: 'd', min: 10, p: 38, tags: ['batch', 'family'], ing: ['chicken', 'salsa', 'tacoseasoning', 'blackbeans'],
    how: ['Put chicken in the slow cooker with a jar of salsa and taco seasoning.', 'Cook on low 6 hours or high 3. Shred with two forks and stir in beans.', 'Use it three ways this week: bowls, tacos, and on a salad.'] },
  { id: 'r17', n: 'Turkey meatballs & marinara', meal: 'd', min: 30, p: 36, tags: ['family', 'batch'], ing: ['groundturkey', 'eggs', 'marinara', 'pasta', 'zucchini'],
    how: ['Mix turkey with 1 egg, salt, pepper and Italian seasoning. Roll into balls and bake at 400°F for 15–18 minutes.', 'Boil pasta. Sauté sliced zucchini.', 'Warm the meatballs in marinara and serve over pasta and zucchini.'] },
  { id: 'r18', n: 'Shrimp veggie stir-fry', meal: 'd', min: 15, p: 30, tags: ['quick'], ing: ['shrimp', 'frozenveg', 'soysauce', 'garlic', 'rice'],
    how: ['Start the rice.', 'Cook frozen veggies in a hot pan until tender.', 'Add thawed shrimp and garlic; cook 3 minutes until pink. Splash with soy sauce.'] },
  { id: 'r19', n: 'Lentil veggie soup', meal: 'd', min: 35, p: 20, tags: ['batch', 'veg', 'family'], ing: ['lentils', 'carrots', 'onion', 'garlic', 'broth', 'cannedtomatoes', 'spinach'],
    how: ['Soften diced onion, carrot and garlic in a pot.', 'Add 1 cup lentils, a can of tomatoes and 5 cups broth. Simmer 25 minutes.', 'Stir in spinach at the end. Freezes well.'] },
  { id: 'r20', n: 'Tofu veggie stir-fry', meal: 'd', min: 20, p: 26, tags: ['quick', 'veg'], ing: ['tofu', 'frozenveg', 'edamame', 'soysauce', 'rice'],
    how: ['Press and cube the tofu; brown it in a hot pan.', 'Add frozen veggies and edamame; cook until tender.', 'Season with soy sauce and serve over rice.'] },
  { id: 'r21', n: 'Egg roll in a bowl', meal: 'd', min: 15, p: 32, tags: ['quick', 'family'], ing: ['groundturkey', 'coleslaw', 'carrots', 'soysauce', 'garlic'],
    how: ['Brown the turkey with garlic.', 'Add a bag of coleslaw mix and shredded carrot; cook 4–5 minutes until just wilted.', 'Season with soy sauce. Good on its own or over rice.'] },
  { id: 'r22', n: 'Cottage cheese & berries', meal: 's', min: 2, p: 15, tags: ['quick', 'nocook', 'veg'], ing: ['cottage', 'berries'], how: ['Half a cup of cottage cheese with a handful of berries.'] },
  { id: 'r23', n: 'Apple, peanut butter & string cheese', meal: 's', min: 2, p: 13, tags: ['quick', 'nocook', 'veg'], ing: ['apple', 'pb', 'stringcheese'], how: ['Slice an apple, add a spoon of peanut butter and a string cheese.'] },
  { id: 'r24', n: 'Edamame cup', meal: 's', min: 4, p: 14, tags: ['quick', 'veg'], ing: ['edamame'], how: ['Microwave a cup of frozen edamame and sprinkle with salt.'] },
  { id: 'r25', n: 'Hard-boiled eggs', meal: 's', min: 15, p: 12, tags: ['batch', 'veg'], ing: ['eggs'], how: ['Boil a batch of eggs 10–11 minutes, cool in ice water.', 'Two eggs is a snack. They keep a week in the fridge.'] },
  { id: 'r26', n: 'Turkey roll-ups & hummus', meal: 's', min: 3, p: 15, tags: ['quick', 'nocook'], ing: ['deliturkey', 'hummus', 'cucumber'], how: ['Roll turkey slices around cucumber sticks and dip in hummus.'] },
  { id: 'r27', n: 'Ranch yogurt dip & veggies', meal: 's', min: 3, p: 14, tags: ['quick', 'nocook', 'veg'], ing: ['greekyogurt', 'ranchmix', 'carrots', 'peppers'], how: ['Stir ranch seasoning into Greek yogurt.', 'Dip carrots and pepper strips.'] }
];

// Mix & Match builder
const MIX = {
  protein: [['Chicken', 35, 'chicken'], ['Ground turkey', 28, 'groundturkey'], ['Lean beef', 30, 'leanbeef'], ['Salmon', 28, 'salmon'], ['Shrimp', 24, 'shrimp'], ['Tuna', 25, 'tuna'],
    ['Eggs + whites', 20, 'eggs'], ['Greek yogurt', 20, 'greekyogurt'], ['Cottage cheese', 25, 'cottage'], ['Tofu', 20, 'tofu'], ['Beans', 15, 'blackbeans'], ['Lentils', 18, 'lentils']],
  veg: ['Roasted veggies', 'Big salad', 'Stir-fry veggies', 'Spinach', 'Broccoli', 'Peppers & onion', 'Berries or fruit'],
  base: ['Rice', 'Sweet potato', 'Quinoa', 'Tortilla or wrap', 'Whole-grain toast', 'Pasta', 'No base today'],
  flavor: ['Salsa', 'Lemon & olive oil', 'Soy & garlic', 'Pesto', 'Hummus', 'Yogurt ranch', 'Marinara', 'Avocado']
};

/* Movement. Each step: [name, seconds, cue] */
const MOVES = [
  ['Health bounce', 'Feet stay flat on the mat. Small, easy pulses from ankles and knees.', 'Easiest. The warm-up and cool-down for everything else.'],
  ['Low march', 'Walk in place on the mat. Knees stay at hip height or lower; land softly.', 'Gentle cardio.'],
  ['Heel-toe prance', 'Pedal the feet — one heel down, the other toes down — arms swinging naturally.', 'Wakes up ankles and calves.'],
  ['Down-bounce', 'Feet shoulder-width, knees soft. Press down into the mat through your heels rather than jumping up.', 'Works glutes and core.'],
  ['Side-to-side sway', 'Shift weight gently right to left with hips slightly back, like a slow skater.', 'Strengthens the outer hips that help steady the knees.'],
  ['Scissor steps', 'Light front-and-back foot switches with soft knees. No height.', 'Brings the heart rate up.']
];
const B = (n, s, c) => [n, s, c];
const REST = 'Soft health bounce. Breathe through your nose and let your heart rate settle.';
function intervals(rounds, work) {
  const out = [B('Health bounce warm-up', 120, 'Feet on the mat, shoulders loose. Easy pulses.')];
  for (let i = 0; i < rounds; i++) { out.push(B(work[i % work.length][0], 40, work[i % work.length][1])); out.push(B('Soft recovery bounce', 20, REST)); }
  out.push(B('Cool-down bounce', 120, 'Slow everything down. Roll your shoulders, shake out your hands.'));
  return out;
}
const WORK = [['Low march', 'Walk it out. Knees no higher than hips, land soft.'], ['Down-bounce', 'Press down through your heels. Knees soft, core gently on.'],
  ['Side-to-side sway', 'Shift right to left, hips back a little.'], ['Heel-toe prance', 'Pedal the feet, swing the arms.'],
  ['Brisk march', 'Pick up the pace. You should still be able to talk in short sentences.'], ['Scissor steps', 'Light front-and-back switches. No height needed.']];

const ROUTINES = [
  { id: 'm1', n: 'First bounce', kind: 'bounce', lvl: 'Easiest', blurb: 'Five gentle minutes with your feet on the mat. A good first day, low-energy day, or morning wake-up.',
    steps: [B('Health bounce', 90, 'Feet stay flat on the mat. Small easy pulses. Breathe in for 4, out for 6.'), B('Low march', 60, 'Walk in place. Knees low, land softly.'), B('Health bounce', 45, 'Back to easy pulses. Let your arms hang loose.'), B('Heel-toe prance', 45, 'Pedal your feet gently, heel then toe.'), B('Health bounce', 60, 'Slow down. Roll your shoulders and neck.')] },
  { id: 'm2', n: 'Knee-comfort & de-stress', kind: 'bounce', lvl: 'Gentle', blurb: 'Fifteen minutes that end with two stretches on the floor. Steady, calming, and easy on the joints.',
    steps: [B('Gentle awakening', 150, 'Health bounce. Feet never leave the mat. Belly breaths: in for 4, out for 6.'), B('Cadence walk', 150, 'Soft march. As one foot presses down, reach the opposite arm forward. Knees below hips.'),
      B('Down-bounce', 60, 'Press down into your heels, knees soft and tracking over your toes.'), B('Side-to-side sway', 60, 'Gentle skater shifts, hips slightly back.'), B('Down-bounce', 60, 'Press down, don\'t jump up.'), B('Side-to-side sway', 60, 'Smooth and easy.'), B('Down-bounce', 60, 'Last round. Core gently on.'),
      B('De-load bounce', 120, 'Back to the health bounce. Drop your shoulders, shake out hands and wrists.'),
      B('Step off: quad & hip stretch, right', 45, 'Stand tall, hold something steady. Bend your right knee and hold the ankle, or just tuck the foot back. Hips forward.'), B('Quad & hip stretch, left', 45, 'Switch sides. Keep your knees close together.'),
      B('Calf stretch, right', 45, 'Hands on the wall, right leg back, heel down.'), B('Calf stretch, left', 45, 'Switch legs. Breathe slowly.')] },
  { id: 'm3', n: 'Cardio builder · 10', kind: 'bounce', lvl: 'Moderate', blurb: 'Six rounds of 40 seconds on, 20 seconds easy. This is the one that builds your breath over time.', steps: intervals(6, WORK) },
  { id: 'm4', n: 'Cardio builder · 16', kind: 'bounce', lvl: 'Moderate+', blurb: 'Twelve rounds. Move up to this when the 10-minute version starts to feel comfortable.', steps: intervals(12, WORK) },
  { id: 'm5', n: 'After-bounce cool-down', kind: 'stretch', lvl: 'Gentle', blurb: 'Five minutes on the floor for the muscles around your knees and hips.',
    steps: [B('Quad & hip flexor stretch, right', 40, 'Stand and hold something steady. Tuck your right foot back toward your seat, hips forward.'), B('Quad & hip flexor stretch, left', 40, 'Switch sides.'), B('Calf stretch, right', 35, 'Hands on the wall, right heel down behind you.'), B('Calf stretch, left', 35, 'Switch legs.'),
      B('Hamstring reach', 50, 'Sit or stand, one leg straight out, hinge forward from the hips with a long back. Switch halfway.'), B('Glute bridges', 60, 'On your back, knees bent. Lift your hips slowly, squeeze, lower slowly.'), B('Rest', 40, 'Lie still. Slow breaths.')] },
  { id: 'm6', n: 'Morning loosen-up', kind: 'stretch', lvl: 'Gentle', blurb: 'Six minutes of easy flexibility work, head to toe.',
    steps: [B('Neck circles', 40, 'Slow half-circles, ear to shoulder. Never force it.'), B('Shoulder rolls', 40, 'Big slow circles back, then forward.'), B('Side bends', 50, 'One arm overhead, lean gently. Switch halfway.'), B('Cat-cow', 60, 'On hands and knees, round your back, then let it dip. Follow your breath.'),
      B('Hip circles', 50, 'Standing, hands on hips, slow circles each way.'), B('Forward fold', 50, 'Soft knees, let your head and arms hang heavy.'), B('Ankle rolls & calf raises', 60, 'Roll each ankle, then rise onto your toes slowly ten times.')] },
  { id: 'm7', n: 'Bedtime unwind', kind: 'stretch', lvl: 'Gentle', blurb: 'Eight slow minutes on the floor or bed to tell your body the day is done.',
    steps: [B('Figure four, right', 60, 'On your back, right ankle over left knee. Draw the legs in gently.'), B('Figure four, left', 60, 'Switch sides.'), B('Knees to chest', 45, 'Hug both knees in and rock slowly.'), B('Lying twist, right', 60, 'Let both knees fall to the right, arms wide.'), B('Lying twist, left', 60, 'Knees to the left.'),
      B('Child\'s pose', 75, 'Knees wide, sink your hips back, forehead down.'), B('Slow breathing', 120, 'Lie flat. In through your nose for 4, out for 6. Nothing to do.')] },
  { id: 'm8', n: 'Three-minute reset', kind: 'stretch', lvl: 'Easiest', blurb: 'For the middle of a long day. Stand up, open up, drink some water.',
    steps: [B('Stand tall & reach', 40, 'Reach both arms overhead, then drop your shoulders.'), B('Chest opener', 40, 'Clasp hands behind you and lift gently.'), B('Hip flexor stretch', 60, 'Step one foot back into a short lunge, tuck your tailbone. Switch halfway.'), B('Slow breaths', 40, 'In for 4, out for 6. Then go get a glass of water.')] },
  { id: 'm9', n: 'Calm breathing', kind: 'breath', lvl: 'Easiest', blurb: 'Four minutes. In for four, out for six. Stop any time it feels uncomfortable.',
    steps: Array.from({ length: 48 }, (_, i) => i % 2 ? B('Breathe out', 6, 'Slowly out through your mouth.') : B('Breathe in', 4, 'Gently in through your nose.')) }
];
const VIDEOS = [
  ['Earth & Owl', 'Knee-friendly, feet-on-the-mat beginner sessions.', 'Earth and Owl knee friendly rebounder beginner'],
  ['Jump&Jacked', 'Upbeat, music-driven 10–20 minute sessions.', 'Jump and Jacked beginner mini trampoline workout'],
  ['SanFran Fitness', 'Walking-pace and lymphatic-style rebounding.', 'SanFran Fitness rebounder walking workout'],
  ['JumpSport Fitness', 'Form tutorials and balance-bar basics.', 'JumpSport Fitness rebounder beginner form']
];

/* Supplement guide — general education, not a prescription. */
const SUPP_GUIDE = [
  { n: 'Vitamin D', what: 'Helps your body absorb calcium for bones; many people in northern states run low in winter.', typical: 'Common label amounts are 600–2,000 IU a day. The adult upper limit is 4,000 IU unless a doctor says otherwise.', note: 'A simple blood test tells you if you actually need it. Worth asking for at your next checkup.', when: 'morning' },
  { n: 'Magnesium (glycinate)', what: 'Involved in muscle and nerve function. Many women take it in the evening; evidence for sleep is modest but it is generally well tolerated.', typical: 'Supplement amounts are usually 100–350 mg. The upper limit from supplements is 350 mg a day.', note: 'Can loosen stools. Ask first if you have kidney problems or take prescription medication.', when: 'bedtime' },
  { n: 'Omega-3 (fish oil)', what: 'The fats found in salmon and sardines. Eating fish twice a week does the same job.', typical: 'Many products provide 250–1,000 mg of combined EPA + DHA.', note: 'Check with your doctor if you take blood thinners.', when: 'morning' },
  { n: 'Creatine monohydrate', what: 'One of the most-studied supplements. Supports muscle strength when paired with exercise, with growing research in women at midlife.', typical: '3–5 grams a day, any time, mixed into a drink.', note: 'Can cause a couple pounds of water weight at first — that is water in muscle, not fat. Skip it if you have kidney disease unless your doctor agrees.', when: 'morning' },
  { n: 'Protein powder', what: 'Not magic, just convenient food. Useful on days when hitting your protein goal from meals is hard.', typical: 'One scoop is usually 20–25 g of protein.', note: 'Look for one with third-party testing (NSF or Informed Choice).', when: 'morning' },
  { n: 'Fiber (psyllium)', what: 'Helps you feel full and keeps digestion regular. Food comes first: beans, berries, oats, veggies.', typical: 'Start with 1 teaspoon in a full glass of water and build up slowly.', note: 'Take it a couple of hours apart from medications, and drink plenty of water with it.', when: 'evening' },
  { n: 'Multivitamin', what: 'A basic safety net if your eating is uneven. It does not replace food.', typical: 'One a day, with a meal.', note: 'More is not better — avoid stacking several products with the same vitamins.', when: 'morning' },
  { n: 'Calcium', what: 'Bone health. Women 19–50 need about 1,000 mg a day in total, and dairy, fortified milks and leafy greens count.', typical: 'Only supplement the gap between food and 1,000 mg, in doses of 500 mg or less.', note: 'Most people who eat dairy daily do not need much extra.', when: 'evening' },
  { n: 'Iron', what: 'Low iron is a common cause of tiredness in women who still have periods.', typical: 'Only take it if a blood test shows you are low.', note: 'Too much iron is harmful. Get tested before starting, and keep it away from children.', when: 'morning' },
  { n: 'Vitamin B12', what: 'Needed for energy and nerves. Mostly an issue if you eat little or no animal food, or take certain medications.', typical: 'Common amounts are 250–1,000 mcg.', note: 'A blood test can check your level.', when: 'morning' },
  { n: 'Collagen', what: 'Popular for skin and joints. The research is mixed and often funded by the companies that sell it.', typical: '10 g a day is what most studies used.', note: 'It counts a little toward protein but is not a complete protein.', when: 'morning' },
  { n: 'Electrolytes', what: 'Sodium, potassium and magnesium in a drink mix. Helpful after heavy sweating; unnecessary for most everyday workouts.', typical: 'One serving in water after a sweaty session.', note: 'Watch the sodium if you have high blood pressure.', when: 'midday' }
];

const WINS = ['Went to bed a little earlier', 'Took a walk', 'Had a real breakfast', 'Stretched', 'Drank water before coffee', 'Took ten minutes for myself', 'Cooked at home', 'Said no to something'];
const CHEERS = ['Nice. That counts.', 'One more good thing done today.', 'Logged. Keep going at your own pace.', 'That\'s the stuff.', 'Small things add up.'];
