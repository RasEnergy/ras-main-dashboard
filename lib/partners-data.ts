export interface PartnerProduct {
	id: string;
	name: string;
	image: string;
	description: string;
	features?: string[];
	link?: string;
}

export interface Partner {
	id: string;
	name: string;
	logo: string;
	category: string;
	tier: "strategic" | "platinum" | "gold" | "silver" | "bronze";
	description?: string;
	website?: string;
	established?: string;
	products?: PartnerProduct[];
}

export const partnersData: Partner[] = [
	// Strategic Partner (formerly "primary")
	{
		id: "strategic-partner",
		name: "MENESHAYE (መነሻዬ)",
		logo: "/assets/images/Meneshaye-logo.png?height=120&width=300&text=EduTech+Solutions",
		category: "Educational Technology",
		tier: "strategic",
		description:
			"MENESHAYE (መነሻዬ) ልጆች እየተዝናኑ ለነገ እድገታቸው የሚበጅ ስኬታማ የትምህርት ቤት ቆይታ እንዲኖራቸው እንዲሁም በሕይወታቸው ውስጥ ብቁና የተሻሉ ሆነው እንዲገኙ የሚያግዛቸውን ትምህርታዊ መጫወቻዎች እና ለመማር ማስተማር አጋዥ የሚሆኑ ምርቶች ለገበያ የሚያቀርብ መለያ ስም ነው፡፡ ",
		website: "https://meneshaye-official.com/",
		established: "2008",
		products: [
			{
				id: "smartlearn-platform",
				name: "የቀለሜ መነሻ ጥቅል",
				image:
					"/assets/images/product-1.png?height=300&width=400&text=SmartLearn",
				description:
					"ልጆች ከእርሳስ አያያዝ ጀምሮ የማዳመጥ፣ የመናገር፣ የማንበብ እና የመፃፍ ችሎታቸውን በተቀናጀ መልኩ በምስል፣ በድምፅና በተግባር የሚለማመዱበት አስደናቂ ጥቅል",
				features: [
					"ማዳመጥ ማንበብ መናገር መጻፍ",
					"ከሁለት ዓመት ጀምሮ እስከ 10 ዓመት ያሉ ልጆች የሚጠቀሙበትከሁለት ዓመት ጀምሮ እስከ 10 ዓመት ያሉ ልጆች የሚጠቀሙበትከሁለት ዓመት ጀምሮ እስከ 10 ዓመት ያሉ ልጆች የሚጠቀሙበትከሁለት ዓመት ጀምሮ እስከ 10 ዓመት ያሉ ልጆች የሚጠቀሙበት",
					"ከ280 በላይ ገፆች ያላቸው፤ እላያቸው ላይ እየፃፉና እያጠፉ ደጋግመው የሚጠቀሙባቸው፤ በዉሃ የማይበላሹ",
				],
				link: "https://meneshaye-official.com/meneshaye-lelije/#products",
			},
			{
				id: "smartlearn-platform",
				name: "መነሻዬ ድክድክ",
				image:
					"/assets/images/product-2.png?height=300&width=400&text=SmartLearn",
				description:
					"ንግግር ማስጀመሪያ - መናገር ካልጀመሩ ልጆች ጀምሮ የሚሆን በድምፅ የተደገፈ የመጀመሪያ ደረጃ መማሪያ",
				features: [
					"ማዳመጥ ማንበብ መናገር መጻፍ",
					"ከሁለት ዓመት ጀምሮ እስከ 10 ዓመት ያሉ ልጆች የሚጠቀሙበት",
					"ከ280 በላይ ገፆች ያላቸው፤ እላያቸው ላይ እየፃፉና እያጠፉ ደጋግመው የሚጠቀሙባቸው፤ በዉሃ የማይበላሹ",
				],
				link: "https://meneshaye-official.com/meneshaye-lelije/#products",
			},
			{
				id: "smartlearn-platform",
				name: "የሒሳብ ሊቅ መነሻ ጥቅል",
				image:
					"/assets/images/product-3.png?height=300&width=400&text=SmartLearn",
				description:
					"ልጆች ቁጥሮችን ከመለየት ጀምሮ መደመር፣ መቀነስ፣ ማካፈል፣ ማባዛት እና ሌሎች መሠረታዊ የሂሳብ ክህሎቶችን በተግባር የሚለማመዱበት ጥቅል",
				features: [
					"ማዳመጥ ማንበብ መናገር መጻፍ",
					"  ከሁለት ዓመት ጀምሮ እስከ 10 ዓመት ያሉ ልጆች የሚጠቀሙበት",
					"ከ280 በላይ ገፆች ያላቸው፤ እላያቸው ላይ እየፃፉና እያጠፉ ደጋግመው የሚጠቀሙባቸው፤ በዉሃ የማይበላሹ",
				],
				link: "https://meneshaye-official.com/meneshaye-lelije/yehisab-liq.html",
			},
		],
	},

	// Supporting Partners
	{
		id: "techsolutions",
		name: "SantimPay Financial Solution, S.C.",
		logo: "https://santimpay.com/assets/SP%20logo-DCfy78Vx.png?height=80&width=120&text=TechEdu",
		category: "Financial Services",
		tier: "platinum",
	},
	{
		id: "edufinance",
		name: "Telebirr",
		logo: "https://dev.ethiotelecom.et/wp-content/uploads/2021/04/TeleBirr-Logo.svg?height=80&width=120&text=EduFinance",
		category: "Financial Services",
		tier: "platinum",
	},
	{
		id: "studentsupport",
		name: "ZERGAW CLOUD",
		logo: "https://zergaw.com/storage/2023/10/blue-by-black@4x.png?height=80&width=120&text=Student+Success",
		category: "Support Services",
		tier: "gold",
	},
	{
		id: "learninginnovations",
		name: "Biisho Technologies",
		logo: "https://biisho.com/wp-content/uploads/2024/08/cropped-WhatsApp_Image_2024-03-01_at_3.31.41_PM-removebg-preview-300x168.png?height=80&width=120&text=Learning+Innovations",
		category: "Digital Solutions",
		tier: "gold",
	},
	{
		id: "digitallearning",
		name: "Arba Minch University Community",
		logo: "https://upload.wikimedia.org/wikipedia/en/e/ef/Arba_Minch_University.png?height=80&width=120&text=Digital+Hub",
		category: "Digital Solutions",
		tier: "silver",
	},
	{
		id: "educationpartners",
		name: "Butajira Community Community",
		logo: "/placeholder.svg?height=80&width=120&text=Education+Partners",
		category: "Consulting Services",
		tier: "bronze",
	},
];

export const partnershipBenefits = [
	{
		icon: "Shield",
		title: "Enhanced Security",
		description:
			"Industry-leading security standards and compliance through our technology partners",
		gradient: "from-blue-500 to-cyan-500",
	},
	{
		icon: "Users",
		title: "Expanded Support",
		description:
			"24/7 comprehensive support network across multiple channels and languages",
		gradient: "from-green-500 to-emerald-500",
	},
	{
		icon: "Sparkles",
		title: "Innovation Access",
		description:
			"Early access to cutting-edge educational technologies and methodologies",
		gradient: "from-purple-500 to-pink-500",
	},
];
