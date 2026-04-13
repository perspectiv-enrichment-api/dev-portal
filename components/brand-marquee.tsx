import Image from "next/image";

const brands = [
  "accor",
  "adobe",
  "africa_world_airlines",
  "air_france",
  "airbnb",
  "alibaba",
  "aliexpress",
  "allied_ghana",
  "amazon",
  "americanexpress",
  "apple",
  "applebees",
  "at_ghana",
  "atlassian",
  "att",
  "authorizenet",
  "axa",
  "azimo",
  "barcelos_flame_grilled_chicken",
  "basecamp",
  "betway",
  "binance",
  "blockchain",
  "bluecross",
  "bluehost",
  "bobshop",
  "bolt",
  "booking",
  "british_airways",
  "bt",
  "burger_king",
  "cadbury",
  "canva",
  "careem",
  "cashapp",
  "checkers-co-za",
  "checkout",
  "chewy",
  "chickfila",
  "china-mall-ghana",
  "clarks",
  "clickup",
  "cloudflare",
  "cocacola",
  "colgate",
  "compughana",
  "contabo",
  "decathlon",
  "delta_air_lines",
  "deutschebank",
  "dickssportinggoods",
  "discoveryplus",
  "disneyplus",
  "dropbox",
  "dstv",
  "ebay",
  "egyptair",
  "electroland_ghana_limited",
  "emirates_airlines",
  "equitybank",
  "ernest_chemists",
  "ethiopian_airlines",
  "etihad_airways",
  "expresspay",
  "f1_tv",
  "facebook",
  "fedex",
  "fido",
  "fika-tea-house",
  "firstbank-ng",
  "Fitrip-ghana",
  "flutterwave",
  "frankies-foods-and-rooms",
  "freeee",
  "freshdesk",
  "ghanaweb",
  "gigi_beauty_bar",
  "github",
  "gitlab",
  "godaddy",
  "goil_plc",
  "gojek",
  "google",
  "gopuff",
  "gotv",
  "graphic-online",
  "gtbank",
  "hm",
  "hubtel",
  "interswitch",
  "jd",
  "jiji",
  "jumia",
  "kcbgroup",
  "kfc",
  "kilimall",
  "klm_royal_dutch_airlines",
  "lc_waikiki",
  "levis",
  "linkedin",
  "lufthansa",
  "lyft",
  "m_a_c",
  "mailchimp",
  "massmutual",
  "masterclass",
  "mawarko-fast-food",
  "mcdonalds",
  "medium",
  "melcom",
  "microsoft",
  "monday",
  "mpharma",
  "mr_price",
  "mtn",
  "mukuru",
  "myjoyonline",
  "name_cheap",
  "netflix",
  "netlify",
  "newrelic",
  "nike",
  "nissan",
  "nord_vpn",
  "ntomapa",
  "olx",
  "onlyfans",
  "panda_mart",
  "papaye",
  "paramountplus",
  "passionair",
  "peacocktv",
  "perspectiv",
  "petra",
  "pillpoint_pharmacy",
  "pinkberry",
  "pizza_hut",
  "pizzaman-chickenman",
  "playstation",
  "porkbun",
  "pulse-ghana",
  "qatar_airways",
  "quizlet",
  "razorpay",
  "reddit",
  "revolut",
  "riteaid",
  "roads_and_transport_authority_Dubai",
  "robinhood",
  "roblox",
  "rosé-garden",
  "safaricom",
  "salesforce",
  "samsung",
  "scentopia",
  "seiko",
  "shakeshack",
  "shaxi",
  "shein",
  "shell_plc",
  "shoprite",
  "silverbird_cinemas",
  "skillshare",
  "slack",
  "smarttransyt",
  "snap",
  "speso",
  "sportybet",
  "spotify",
  "square",
  "squarespace",
  "staroil",
  "stripe",
  "surfshark",
  "telecel",
  "telefonika",
  "temu",
  "tesla",
  "the_hair_senta",
  "tonaton",
  "total_energies",
  "tumblr",
  "turkish_airlines",
  "uber",
  "united_airlines",
  "vida_e_caffe",
  "walmart",
  "wish",
  "woodin",
  "wordpress",
  "wp-engine",
  "x",
  "yah_icecream",
  "yango",
  "yildiz_pharmacy",
  "youtube",
  "zen_petroleum_limited",
  "zen-garden-accra",
  "zendesk",
  "zenithbank",
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const shuffledBrands = shuffle(brands);

export function BrandMarquee() {
  return (
    <section className="py-20 overflow-hidden border-y border-border bg-card/30">
      <p className="text-center text-lg text-primary mb-8">
        Access over{" "}
        <span className="relative inline-flex items-center justify-center align-middle">
          <Image
            src="/images/icons/circle.png"
            alt="Circle"
            width={50}
            height={50}
            className="relative z-0"
          />
          <span className="absolute inset-0 flex items-center justify-center font-extrabold text-primary text-lg z-10">
            1M
          </span>
        </span>{" "}
        merchants across the globe.
      </p>
      <div className="flex">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex shrink-0 animate-marquee gap-8 pr-8 ![animation-play-state:running]"
            aria-hidden={i === 1}
          >
            {shuffledBrands.map((brand) => (
              <div
                key={brand}
                className="w-16 h-16 relative  rounded-[2px] border border-border p-1"
              >
                <Image
                  src={`/images/brands/${brand}.png`}
                  alt={brand}
                  fill
                  sizes="64px"
                  loading="lazy"
                  className="object-contain p-0"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
