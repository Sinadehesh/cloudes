/**
 * General-interest information for each cloud's page: what it is, where and when to see it, a
 * little history or lore, and the old weather saying that goes with it, if there is one.
 *
 * Weather sayings are folklore, not forecasts; the cloud page's safety note says so.
 */
export interface CloudDetails {
  about: string;
  where: string;
  lore?: string;
  saying?: string;
}

export const CLOUD_DETAILS: Record<string, CloudDetails> = {
  // The 10 main types
  cumulus: {
    about:
      'Detached, puffy heaps with flat bases and bright, rounded tops. Each one is built by a bubble of warm air (a thermal) rising from ground heated by the Sun.',
    where: 'Almost everywhere on Earth, most often over land on sunny days, from late morning to late afternoon.',
    lore: 'The English chemist Luke Howard named it in 1802, from the Latin for “heap”. His names cumulus, stratus, cirrus and nimbus are still the basis of every cloud name used today.',
  },
  stratocumulus: {
    about:
      'Grey or whitish patches, rolls or a lumpy sheet, usually with gaps of blue between them. It forms when a moist layer is stirred by the wind, or when cumulus spread out under a lid of warmer air.',
    where:
      'Worldwide and all year. Huge decks lie over the cool oceans off the west coasts of the Americas, Africa and Australia.',
    lore: 'Those ocean decks reflect so much sunlight that they cool the whole planet, so how they change as the climate warms is one of the big questions in climate science.',
  },
  stratus: {
    about:
      'A flat, featureless grey layer with a low, even base. It forms when moist air cools gently near the ground, or when a fog lifts.',
    where: 'Common near coasts and in hills and valleys, especially in the cooler months. It often burns off by midday.',
    lore: 'Stratus is Latin for “spread out”. Luke Howard called it the cloud of night, because it so often forms after sunset and fades in the morning.',
  },
  nimbostratus: {
    about:
      'A thick, dark grey layer, often several kilometres deep, that hides the Sun completely. Its base is blurred by the rain or snow falling from it.',
    where:
      'Mainly in the middle latitudes, along warm fronts and in large areas of low pressure, especially in autumn and winter.',
    lore: 'Nimbus is Latin for “rain cloud”; it is also the word for the halo painted around the heads of saints.',
    saying: 'Rain before seven, fine by eleven.',
  },
  altostratus: {
    about:
      'A grey or bluish sheet in the middle of the sky, thin enough in places to show the Sun as a dim disc, but never with a halo. It usually thickens from cirrostratus as a warm front comes closer.',
    where: 'Worldwide, most often in the middle latitudes ahead of a warm front; rain often follows within hours.',
    lore: 'The pale, “watery” Sun seen through altostratus is one of the oldest signs in weather lore that rain is on its way.',
  },
  altocumulus: {
    about:
      'Patches, rows or rolls of white or grey rounded cloudlets in the middle of the sky, each about the width of your thumb at arm’s length.',
    where: 'Worldwide and all year. It can come with fair weather or arrive ahead of a change.',
    lore: 'Sunlight passing through its tiny droplets can paint a coloured ring (a corona) around the Sun or Moon, or pastel colours along the cloudlets’ edges.',
    saying: 'Mackerel sky, mackerel sky, never long wet and never long dry.',
  },
  cirrus: {
    about:
      'Delicate white strands, hooks or feathers made of ice crystals, high above all the other common clouds, with no grey shading underneath.',
    where:
      'Worldwide and all year: about 5–13 km up in temperate regions, and as high as 18 km in the tropics.',
    lore: 'Cirrus is Latin for “a curl of hair”. The way its ice trails stream away shows the direction of the winds high above.',
  },
  cirrocumulus: {
    about:
      'A thin white layer of tiny grains or ripples, far smaller than altocumulus cloudlets and with no grey shading.',
    where: 'Worldwide but uncommon. It is usually short-lived and mixed in with cirrus or cirrostratus.',
    lore: 'Its ripples look like the pattern on a mackerel’s back, which gave weather lore its “mackerel sky”.',
    saying: 'Mackerel sky, not twenty-four hours dry.',
  },
  cirrostratus: {
    about:
      'A thin, milky veil of ice crystals that can cover the whole sky. The Sun still shines through it clearly enough to cast shadows.',
    where: 'Worldwide. In the middle latitudes it often spreads ahead of a warm front, a day or so before rain.',
    lore: 'Its ice crystals act like millions of tiny prisms, bending sunlight into halos, sun dogs and other arcs.',
    saying: 'Ring around the Moon, rain soon.',
  },
  cumulonimbus: {
    about:
      'The thunderstorm cloud: a huge tower with a dark base, heavy rain or hail, lightning and gusty winds, usually topped by a flat anvil of ice.',
    where:
      'Most common in the tropics and over land in summer. The Congo basin and Lake Maracaibo in Venezuela have more lightning than anywhere else on Earth.',
    lore: 'Around 2,000 thunderstorms are active somewhere on Earth at any moment.',
    saying: 'When thunder roars, go indoors.',
  },

  // Species and varieties
  'cumulus-humilis': {
    about: 'The smallest cumulus: flattened puffs, wider than they are tall, made by weak thermals.',
    where: 'Over land in settled weather, especially under high pressure, from late morning on.',
    lore: 'Humilis is Latin for “humble” or “low”. Glider pilots use them as markers of rising air.',
  },
  'cumulus-mediocris': {
    about: 'Cumulus of moderate size with lumpy, sprouting tops, about as tall as it is wide.',
    where: 'Over land on warm days, often growing out of humilis by early afternoon.',
    lore: 'Mediocris is Latin for “middling”. If the air higher up is unstable, it can keep growing into congestus.',
  },
  'cumulus-congestus': {
    about: 'Tall, towering cumulus with sharp cauliflower tops, taller than it is wide. It can give heavy showers.',
    where:
      'Common in the tropics, and in summer over land elsewhere. Tropical congestus often rains heavily without ever making thunder.',
    lore: 'Congestus is Latin for “heaped up”. Pilots call it towering cumulus (TCU) and steer around its strong up- and downdraughts.',
  },
  'cumulus-fractus': {
    about: 'Ragged, torn shreds of cumulus with no clear shape, changing from minute to minute.',
    where: 'Everywhere, especially on windy days and in the morning as the first cumulus begin to form.',
    lore: 'Fractus is Latin for “broken”. Sailors and pilots call low, fast-moving shreds of cloud “scud”.',
  },
  'cirrus-uncinus': {
    about: 'Cirrus shaped like commas or hooks: a small tuft at the top and a long tail of falling ice.',
    where: 'In the middle latitudes, often several hours to a day ahead of a warm front.',
    lore: 'Uncinus is Latin for “hooked”. The hooks show that the wind changes speed or direction with height.',
  },
  'cirrus-spissatus': {
    about: 'Dense patches of cirrus, thick enough to look grey when seen against the Sun.',
    where: 'Often near thunderstorms, as the remains of their anvils drift away downwind.',
    lore: 'Spissatus is Latin for “thickened”. Older books called these left-over anvils “false cirrus”.',
  },
  'altocumulus-lenticularis': {
    about:
      'Smooth, lens- or almond-shaped clouds that stay in one place while the wind blows through them. They sit on the crests of invisible air waves.',
    where: 'Downwind of mountain ranges: the Rockies, the Andes, the Alps and the Sierra Nevada are famous for them.',
    lore: 'Lenticularis is Latin for “lens-shaped”. Stacks of them are nicknamed “pile of plates”, and glider pilots ride the wave lift beneath them to great heights.',
  },
  'altocumulus-castellanus': {
    about: 'Altocumulus with little turrets sprouting from a shared base, like the battlements of a castle.',
    where: 'Mostly in summer, often in the morning before afternoon thunderstorms.',
    lore: 'Castellanus is Latin for “castle-like”. Forecasters treat it as a sign of unstable air in the middle of the sky.',
  },
  'altocumulus-floccus': {
    about: 'Small, ragged tufts of cloud with no flat base, often trailing wisps beneath them.',
    where: 'Often alongside castellanus on warm, humid days, or in what is left of thunderstorms.',
    lore: 'Floccus is Latin for “a tuft of wool”.',
  },
  'cumulonimbus-calvus': {
    about:
      'A young thunderstorm cloud whose top has started to turn to ice and lose its sharp cauliflower outline, before an anvil has formed.',
    where: 'Wherever thunderstorms grow, most often on summer afternoons.',
    lore: 'Calvus is Latin for “bald”. Lightning and heavy showers can already come from it.',
  },
  'cumulonimbus-incus': {
    about: 'A mature thunderstorm cloud topped by a spreading, flat, fibrous anvil of ice.',
    where: 'Most common in summer and in the tropics. Its anvil can stretch for hundreds of kilometres downwind.',
    lore: 'Incus is Latin for “anvil”, the iron block a blacksmith hammers on. A dome bulging above the anvil, the overshooting top, marks an especially strong updraught.',
  },

  // Special and rare
  mammatus: {
    about: 'Rounded pouches hanging from the underside of a cloud, most often beneath a thunderstorm’s anvil.',
    where: 'Mostly with summer thunderstorms, and at their best in low evening sunlight.',
    lore: 'The name comes from the Latin mamma, “udder”. They look menacing but are harmless in themselves: the danger is the storm they hang from.',
  },
  arcus: {
    about:
      'A low, horizontal, wedge-shaped cloud along the leading edge of a thunderstorm, often with a dark, layered underside.',
    where: 'Wherever lines of thunderstorms pass, often over open plains and coasts in summer.',
    lore: 'Arcus is Latin for “arch”. It is better known as a shelf cloud: cold air flowing out of the storm lifts the warm air ahead of it.',
  },
  'roll-cloud': {
    about:
      'A long, low, tube-shaped cloud, completely detached from other clouds, that seems to roll slowly around its own length.',
    where:
      'Rare. Seen near coasts and storm outflows; the best known form over the Gulf of Carpentaria in Queensland, Australia, from September to November.',
    lore: 'Its official name is volutus, Latin for “rolled”.',
  },
  'wall-cloud': {
    about:
      'An abrupt lowering of the cloud base beneath the rain-free part of a thunderstorm, where the storm draws in warm, moist air.',
    where:
      'Under supercell thunderstorms, most often in the central United States in spring, but also in Europe, Argentina and Bangladesh.',
    lore: 'Its official name is murus, Latin for “wall”. Storm spotters watch whether it rotates, because that is where tornadoes can form.',
  },
  'funnel-cloud': {
    about: 'A cone or rope of cloud hanging from a storm’s base, marking a column of rapidly spinning air.',
    where: 'Wherever strong thunderstorms or tall showers form; waterspouts are common in places such as the Florida Keys.',
    lore: 'Its official name is tuba, Latin for “trumpet”.',
  },
  pileus: {
    about: 'A small, smooth cap or hood of cloud just above the top of a fast-growing cumulus or cumulonimbus.',
    where: 'Wherever strong showers or thunderstorms are growing, and sometimes above volcanic eruption columns.',
    lore: 'The pileus was a felt cap worn in ancient Rome, given to slaves when they were freed.',
  },
  virga: {
    about: 'Wisps or trails of rain or snow hanging below a cloud that evaporate before they reach the ground.',
    where: 'Most common in dry climates, such as deserts and the American West, where the air beneath the cloud is dry.',
    lore: 'Virga is Latin for “rod” or “twig”. Evaporating virga chills the air, which can then sink fast and cause sudden gusts.',
  },
  'fallstreak-hole': {
    about:
      'A round or long gap in a thin layer of altocumulus or cirrocumulus, often with wispy streaks of ice falling from its middle.',
    where: 'Worldwide, especially near busy airports and flight paths, where aircraft pass through layers of supercooled droplets.',
    lore: 'Officially called cavum (Latin for “hole”), it is also known as a hole-punch cloud.',
  },
  'kelvin-helmholtz': {
    about: 'A row of curls like breaking ocean waves along the top of a cloud layer.',
    where: 'Anywhere with strong wind shear, often on windy days and near mountains. They vanish within minutes, so they are rarely seen.',
    lore: 'Named after the physicists Lord Kelvin and Hermann von Helmholtz, who studied this kind of wave in the 1800s. Its official name is fluctus, Latin for “wave”.',
  },
  asperitas: {
    about: 'A dramatic, wavy underside to a cloud layer that looks like a rough sea seen from below.',
    where: 'Worldwide but rare; many of the best photos come from the American Midwest and from New Zealand.',
    lore: 'Asperitas is Latin for “roughness”. The Cloud Appreciation Society campaigned for it, and it became the first new cloud feature recognised in more than 50 years.',
  },
  contrail: {
    about:
      'Lines of cloud left by aircraft: water vapour in the engine exhaust freezes into ice crystals in the cold air high up.',
    where: 'Wherever jets fly, most of all along busy air routes over the North Atlantic, Europe and North America.',
    lore: 'The name is short for “condensation trail”. Since 2017 the cloud atlas has listed them as cirrus homogenitus: clouds made by people.',
  },
  pyrocumulus: {
    about: 'A cumulus cloud built by the intense heat of a wildfire or volcano, often grey or brown with smoke.',
    where: 'Above large wildfires, such as those in Australia, Canada and the western United States.',
    lore: 'Its official name is flammagenitus, “born of flame”. When it grows into a thunderstorm, it is called pyrocumulonimbus.',
  },
  noctilucent: {
    about:
      'Thin, wavy, silvery-blue clouds of ice about 80 km up, in the mesosphere, still lit by the Sun after it has set for everyone on the ground.',
    where: 'From latitudes of about 50–70°, north and south, in the weeks either side of midsummer.',
    lore: 'They were first reported in 1885, two years after the eruption of Krakatoa, and seem to be seen more often now than they used to be.',
  },
  nacreous: {
    about:
      'Brilliant, slowly shifting clouds with mother-of-pearl colours, forming in the stratosphere at about 15–25 km.',
    where: 'Polar regions in winter, such as Scandinavia, Scotland, Iceland and Antarctica, around sunrise and sunset.',
    lore: 'Nacre is the shiny lining of a shell. Scientists call them polar stratospheric clouds.',
  },
  fog: {
    about: 'Cloud at ground level, made of tiny water droplets, that cuts how far you can see to less than 1 km.',
    where: 'Common in valleys on clear, calm nights, along cold coasts, and over lakes and rivers in autumn.',
    lore: 'In Chile’s Atacama Desert, one of the driest places on Earth, people catch coastal fog in fine nets to collect drinking water.',
  },
};
