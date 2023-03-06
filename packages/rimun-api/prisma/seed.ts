/**
 * This script populates the database with necessary values for
 * the application to work correctly.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.forum.createMany({
    data: [
      {
        acronym: "GA",
        name: "General Assembly",
        image_path: "img/forums/ga.jpg",
        description: `
The **General Assembly** (GA) occupies a central position as the chief deliberative, policymaking and representative organ of the United Nations. The General Assembly comprises all 193 Member States of the United Nations. Each Member state has one vote and shall have not more than five representatives in the General Assembly.

The General Assembly is composed by six Committees that meet separately in the first three days of the conference; each Committee drafts and debates resolutions concerning its mandate, that includes vast topics related to peace, security, disarmament, development, environment and human rights. The General Assembly will discuss passed resolutions during the plenary session, which occurs on the last day of the conference.
      `,
      },
      {
        acronym: "ECOSOC",
        name: "Economic and Social Council",
        image_path: "img/forums/ecosoc.jpg",
        description: `
The **Economic and Social Council** (ECOSOC) is one of the six main organs of the United Nations. It is the principal body for coordination, policy review, policy dialogue and recommendations on economic, social and environmental issues, as well as for implementation of the internationally agreed development goals. ECOSOC is made of six Commissions which take care of different duties.

In the first phase of the Conference all six Commissions work separately and independently discussing three topics each and writing down resolutions. In the second and last part, all chairs are called to choose a resolution per commission which is going to be discussed in the Plenary Session, where Commissions are gathered together, held by the President of ECOSOC.
      `,
      },
      {
        acronym: "HRC",
        name: "Human Rights Council",
        image_path: "img/forums/hrc.jpg",
        description: `
The **Human Rights Council** (HRC) is the main inter-governmental body within the United Nations system whose attention is focused on the protection of human rights and the resolution of human rights violations.

The range of topics discussed is very wide and can concern all thematic human rights issues and situations that require the attention of the council throughout the year.

The Human Rights Council is composed of 47 member states elected by the members of the General Assembly. The Advisory Committee functions as a think-tank for the Council, it is a specialized committee composed of 18 independent experts who mainly focus on studies and research-based advice. During the first three days of Conference the two bodies of HRC and AC work independently one from each other writing, debating and voting resolutions. The President of the HRC, helped by the vice presidents and chairs, coordinates the discussion on the last day of the conference in which both bodies meet together in order to share the resolutions passed.      
`,
      },
      {
        acronym: "SC",
        name: "Security Council",
        image_path: "img/forums/sc.jpg",
        description: `
The United Nations **Security Council** (SC) is one of the principal organs of the United Nations and is charged with the maintenance of international peace and security. Its powers include the establishment of peacekeeping operations, the establishment of international sanctions, and the authorization of military action. Under the Charter of the United Nations, all Member States are obligated to comply with Council decisions.

SC is composed of 15 members. In these five veto-wielding permanent members (P5)—China, France, Russia, the United Kingdom, and the United State—are included. In addition to the P5, there are 10 non-permanent members, with five elected each year to serve two-year terms.

The SC deals with very hot issues on the agenda that primarily concern international peace, stability and security and this is the reason why every solution is deeply discussed in order to be adopted. The rules of procedure are settled by the President and the Vice-President who are also in charge of guarantee that veto is not overused.      
`,
      },
      {
        acronym: "ICJ",
        name: "International Court of Justice",
        image_path: "img/forums/icj.jpg",
        description: `
The **International Court of Justice** (ICJ) is the judicial organ of the United Nations. 193 States are currently Members of the United Nations and recognize as compulsory the jurisdiction of the Court. The Court’s role is to settle, in accordance with international law, legal disputes submitted to it by States and to give advisory opinions on legal questions referred to it by authorized United Nations organs and specialized agencies.

The court is composed by the Presidency (Head of the ICJ, President of the ICJ and Vice-President), the Registry, four advocates (two per party) and an odd number of judges varying between 15 and 19.

A judge must be a person of high moral character, who possess the qualifications required in their respective countries for appointment to the highest judicial offices, or are jurisconsults of recognized competence in international law. Once elected, a Member of the Court is a delegate neither of the government of his own country nor of that of any other State. Unlike most other organs of international organizations, the Court is not composed of representatives of governments. Members of the Court are independent judges whose first task, before taking up their duties, is to make a solemn declaration in open court that they will exercise their powers impartially and conscientiously.
`,
      },
      {
        acronym: "CC",
        name: "Crisis Committee",
        image_path: "img/forums/cc.jpg",
        description: `
The **Crisis Committee** (CC) was established by The Secretariat of the XI session of RIMUN, and as the name implies, it deals with worldwide crises.

The delegates will be presented with a crisis: their mission? Avoid catastrophe, save lives, and possibly solve the crisis for good. The crises will be designed by our team of RIMUN Crisis writers, who will try to create the most realistic, engaging, and challenging fictional crises for delegates to solve. The crises will naturally be based on real life events, but will be infused with twists and developments, that will depend heavily on the delegate’s actions, and interactions with each other inside the Committee.

The main feature of the Crisis Committee is that it works in real time, therefore no information about the crises will be provided beforehand. At the completion of each crisis, information on the new one will be provided. As such it will not be possible to prepare amendments in advance.

The delegates who will participate in the Crisis Committee will be required to submit a position paper on their assigned country and they will be required to study their assigned country’s stats (Population, religion, GDP, Interests etc), foreign policy, and a general understanding of the domestic policy. This is necessary to ensure that the delegates are able to grasp the implications of certain events in the crisis, as well as make informed decisions as to what to do.            
      `,
      },
      {
        acronym: "HSC",
        name: "Historical Security Council",
        image_path: "img/forums/hsc.jpg",
        description: `
The **Historical Security Council** (HSC) is a forum reserved to undergraduate students, which sets the well-known UN Security Council back to one of the most significant chapters of the history of the contemporary world.

With the power held by the Council, delegates are called upon to make important decisions concerning political crises that could reshape the course of history as it's known. Furthermore, the Security Council’s composition and participating Nations are based on the chosen historical period and any event following the starting year can't be mentioned as it hadn’t happened in the simulated setting yet.

The Security Council must take its decisions in the interest of international peace and maintain a secure environment for the citizens of the world: its powers include the establishment of peacekeeping operations, the formulation of international sanctions, and the authorization of military action.

The Security Council is composed of fifteen nnmembers; of these, five veto-helding permanent members are present since the constitution of the United Nations Organisation: these are commonly known as the P5, and comprise China, France, Russia, the United Kingdom, and the United States of America; the remaining ten member States of the Security Council are non-permanent.

In the case of the Historical Security Council, present member States will reprise the geopolitical structure pertinent to the period in which the forum is set for the duration of the conference (e.g. Russia will be the USSR if the setting takes place between 1945 and 1991).

What makes this forum unique is that Historical Security Council’s delegates will immerse themselves in times of engaging geopolitical issues, trying to solve them to the best of their abilities: it is a extraordinary and remarkable experience that will enrich your understanding of the passed that shaped today’s world.      
`,
      },
    ],
  });

  await prisma.resource.createMany({
    data: [
      { name: "application" },
      { name: "assignment" },
      { name: "committee" },
      { name: "delegation" },
      { name: "document" },
      { name: "export" },
      { name: "faq" },
      { name: "gallery" },
      { name: "housing" },
      { name: "news" },
      { name: "payment" },
      { name: "permission" },
      { name: "search" },
      { name: "team" },
      { name: "session" },
      { name: "hall-of-fame" },
    ],
  });

  await prisma.group.createMany({
    data: [
      { id: 1, name: "secretariat" },
      { id: 2, name: "staff" },
      { id: 3, name: "director" },
      { id: 4, name: "chair" },
      { id: 5, name: "delegate" },
      { id: 6, name: "icj" },
      { id: 7, name: "hsc" },
      { id: 8, name: "guest" },
    ],
  });

  await prisma.role.createMany({
    data: [
      { group_id: 1, name: "Secretary General" },
      { group_id: 1, name: "Conference Director" },
      { group_id: 1, name: "President of the General Assembly", forum_id: 1 },
      { group_id: 1, name: "President of the Eco.So.C.", forum_id: 2 },
      {
        group_id: 1,
        name: "President of the Human Rights Council",
        forum_id: 3,
      },
      { group_id: 1, name: "President of the Security Council", forum_id: 4 },
      {
        group_id: 1,
        name: "President of the Historical Security Council",
        forum_id: 7,
      },
      {
        group_id: 1,
        name: "Conference Manager for Relations with International Delegations",
      },
      { group_id: 1, name: "Conference Manager for Materials and Budget" },
      {
        group_id: 1,
        name: "Conference Manager for Sponsors and Institutional Relations",
      },
      {
        group_id: 1,
        name: "Conference Manager for Human Resources and Public Relations",
      },
      { group_id: 1, name: "Housing Manager" },
      { group_id: 1, name: "Transfer Manager" },
      { group_id: 1, name: "Head of ICJ", forum_id: 5 },
      {
        group_id: 4,
        name: "Vice President of the Human Rights Council",
        forum_id: 3,
      },
      {
        group_id: 4,
        name: "Vice President of the Security Council",
        forum_id: 4,
      },
      {
        group_id: 4,
        name: "Vice President of the Historical Security Council",
        forum_id: 7,
      },
      { group_id: 4, name: "Main Chair" },
      { group_id: 4, name: "Deputy Chair" },
      { group_id: 5, name: "Delegate" },
      { group_id: 6, name: "President of the ICJ", forum_id: 5 },
      { group_id: 6, name: "Vice President of the ICJ", forum_id: 5 },
      { group_id: 6, name: "Register" },
      { group_id: 6, name: "Judge" },
      { group_id: 6, name: "Advocate" },
      { group_id: 2, name: "Administrative staff" },
      { group_id: 2, name: "Computer staff" },
      { group_id: 2, name: "Layout staff" },
      { group_id: 2, name: "Reception staff" },
      { group_id: 2, name: "Security staff" },
      { group_id: 2, name: "Press staff" },
      { group_id: 2, name: "Head of Administration" },
      { group_id: 2, name: "Head of Layout" },
      { group_id: 2, name: "Head of Reception" },
      { group_id: 2, name: "Head of Security" },
      { group_id: 2, name: "Head of Press" },
      { group_id: 3, name: "Main Director" },
      { group_id: 3, name: "Director" },
      { group_id: 8, name: "Guest" },
      { group_id: 7, name: "Delegate" },
      { group_id: 2, name: "Head of Staff" },
      { group_id: 1, name: "Conference Manager for Materials and Gadgets" },
      { group_id: 2, name: "Secretariat Staff" },
      { group_id: 2, name: "Kitchen Staff" },
      { group_id: 4, name: "Crisis Writer" },
      { group_id: 2, name: "Teacher Staff" },
    ],
  });

  await prisma.country.createMany({
    data: [
      { code: "AF", name: "Afghanistan" },
      { code: "AL", name: "Albania" },
      { code: "DZ", name: "Algeria" },
      { code: "DS", name: "American Samoa" },
      { code: "AD", name: "Andorra" },
      { code: "AO", name: "Angola" },
      { code: "AI", name: "Anguilla" },
      { code: "AQ", name: "Antarctica" },
      { code: "AG", name: "Antigua and Barbuda" },
      { code: "AR", name: "Argentina" },
      { code: "AM", name: "Armenia" },
      { code: "AW", name: "Aruba" },
      { code: "AU", name: "Australia" },
      { code: "AT", name: "Austria" },
      { code: "AZ", name: "Azerbaijan" },
      { code: "BS", name: "Bahamas" },
      { code: "BH", name: "Bahrain" },
      { code: "BD", name: "Bangladesh" },
      { code: "BB", name: "Barbados" },
      { code: "BY", name: "Belarus" },
      { code: "BE", name: "Belgium" },
      { code: "BZ", name: "Belize" },
      { code: "BJ", name: "Benin" },
      { code: "BM", name: "Bermuda" },
      { code: "BT", name: "Bhutan" },
      { code: "BO", name: "Bolivia" },
      { code: "BA", name: "Bosnia and Herzegovina" },
      { code: "BW", name: "Botswana" },
      { code: "BV", name: "Bouvet Island" },
      { code: "BR", name: "Brazil" },
      { code: "IO", name: "British Indian Ocean Territory" },
      { code: "BN", name: "Brunei Darussalam" },
      { code: "BG", name: "Bulgaria" },
      { code: "BF", name: "Burkina Faso" },
      { code: "BI", name: "Burundi" },
      { code: "KH", name: "Cambodia" },
      { code: "CM", name: "Cameroon" },
      { code: "CA", name: "Canada" },
      { code: "CV", name: "Cape Verde" },
      { code: "KY", name: "Cayman Islands" },
      { code: "CF", name: "Central African Republic" },
      { code: "TD", name: "Chad" },
      { code: "CL", name: "Chile" },
      { code: "CN", name: "China" },
      { code: "CX", name: "Christmas Island" },
      { code: "CC", name: "Cocos (Keeling) Islands" },
      { code: "CO", name: "Colombia" },
      { code: "KM", name: "Comoros" },
      { code: "CG", name: "Congo" },
      { code: "CK", name: "Cook Islands" },
      { code: "CR", name: "Costa Rica" },
      { code: "HR", name: "Croatia (Hrvatska)" },
      { code: "CU", name: "Cuba" },
      { code: "CY", name: "Cyprus" },
      { code: "CZ", name: "Czech Republic" },
      { code: "DK", name: "Denmark" },
      { code: "DJ", name: "Djibouti" },
      { code: "DM", name: "Dominica" },
      { code: "DO", name: "Dominican Republic" },
      { code: "TP", name: "East Timor" },
      { code: "EC", name: "Ecuador" },
      { code: "EG", name: "Egypt" },
      { code: "SV", name: "El Salvador" },
      { code: "GQ", name: "Equatorial Guinea" },
      { code: "ER", name: "Eritrea" },
      { code: "EE", name: "Estonia" },
      { code: "ET", name: "Ethiopia" },
      { code: "FK", name: "Falkland Islands (Malvinas)" },
      { code: "FO", name: "Faroe Islands" },
      { code: "FJ", name: "Fiji" },
      { code: "FI", name: "Finland" },
      { code: "FR", name: "France" },
      { code: "FX", name: "France, Metropolitan" },
      { code: "GF", name: "French Guiana" },
      { code: "PF", name: "French Polynesia" },
      { code: "TF", name: "French Southern Territories" },
      { code: "GA", name: "Gabon" },
      { code: "GM", name: "Gambia" },
      { code: "GE", name: "Georgia" },
      { code: "DE", name: "Germany" },
      { code: "GH", name: "Ghana" },
      { code: "GI", name: "Gibraltar" },
      { code: "GK", name: "Guernsey" },
      { code: "GR", name: "Greece" },
      { code: "GL", name: "Greenland" },
      { code: "GD", name: "Grenada" },
      { code: "GP", name: "Guadeloupe" },
      { code: "GU", name: "Guam" },
      { code: "GT", name: "Guatemala" },
      { code: "GN", name: "Guinea" },
      { code: "GW", name: "Guinea-Bissau" },
      { code: "GY", name: "Guyana" },
      { code: "HT", name: "Haiti" },
      { code: "HM", name: "Heard and Mc Donald Islands" },
      { code: "HN", name: "Honduras" },
      { code: "HK", name: "Hong Kong" },
      { code: "HU", name: "Hungary" },
      { code: "IS", name: "Iceland" },
      { code: "IN", name: "India" },
      { code: "IM", name: "Isle of Man" },
      { code: "ID", name: "Indonesia" },
      { code: "IR", name: "Iran (Islamic Republic of)" },
      { code: "IQ", name: "Iraq" },
      { code: "IE", name: "Ireland" },
      { code: "IL", name: "Israel" },
      { code: "IT", name: "Italy" },
      { code: "CI", name: "Ivory Coast" },
      { code: "JE", name: "Jersey" },
      { code: "JM", name: "Jamaica" },
      { code: "JP", name: "Japan" },
      { code: "JO", name: "Jordan" },
      { code: "KZ", name: "Kazakhstan" },
      { code: "KE", name: "Kenya" },
      { code: "KI", name: "Kiribati" },
      { code: "KP", name: "Korea, Democratic People's Republic of" },
      { code: "KR", name: "Korea, Republic of" },
      { code: "XK", name: "Kosovo" },
      { code: "KW", name: "Kuwait" },
      { code: "KG", name: "Kyrgyzstan" },
      { code: "LA", name: "Lao People's Democratic Republic" },
      { code: "LV", name: "Latvia" },
      { code: "LB", name: "Lebanon" },
      { code: "LS", name: "Lesotho" },
      { code: "LR", name: "Liberia" },
      { code: "LY", name: "Libyan Arab Jamahiriya" },
      { code: "LI", name: "Liechtenstein" },
      { code: "LT", name: "Lithuania" },
      { code: "LU", name: "Luxembourg" },
      { code: "MO", name: "Macau" },
      { code: "MK", name: "Macedonia" },
      { code: "MG", name: "Madagascar" },
      { code: "MW", name: "Malawi" },
      { code: "MY", name: "Malaysia" },
      { code: "MV", name: "Maldives" },
      { code: "ML", name: "Mali" },
      { code: "MT", name: "Malta" },
      { code: "MH", name: "Marshall Islands" },
      { code: "MQ", name: "Martinique" },
      { code: "MR", name: "Mauritania" },
      { code: "MU", name: "Mauritius" },
      { code: "TY", name: "Mayotte" },
      { code: "MX", name: "Mexico" },
      { code: "FM", name: "Micronesia, Federated States of" },
      { code: "MD", name: "Moldova, Republic of" },
      { code: "MC", name: "Monaco" },
      { code: "MN", name: "Mongolia" },
      { code: "ME", name: "Montenegro" },
      { code: "MS", name: "Montserrat" },
      { code: "MA", name: "Morocco" },
      { code: "MZ", name: "Mozambique" },
      { code: "MM", name: "Myanmar" },
      { code: "NA", name: "Namibia" },
      { code: "NR", name: "Nauru" },
      { code: "NP", name: "Nepal" },
      { code: "NL", name: "Netherlands" },
      { code: "AN", name: "Netherlands Antilles" },
      { code: "NC", name: "New Caledonia" },
      { code: "NZ", name: "New Zealand" },
      { code: "NI", name: "Nicaragua" },
      { code: "NE", name: "Niger" },
      { code: "NG", name: "Nigeria" },
      { code: "NU", name: "Niue" },
      { code: "NF", name: "Norfolk Island" },
      { code: "MP", name: "Northern Mariana Islands" },
      { code: "NO", name: "Norway" },
      { code: "OM", name: "Oman" },
      { code: "PK", name: "Pakistan" },
      { code: "PW", name: "Palau" },
      { code: "PS", name: "Palestine" },
      { code: "PA", name: "Panama" },
      { code: "PG", name: "Papua New Guinea" },
      { code: "PY", name: "Paraguay" },
      { code: "PE", name: "Peru" },
      { code: "PH", name: "Philippines" },
      { code: "PN", name: "Pitcairn" },
      { code: "PL", name: "Poland" },
      { code: "PT", name: "Portugal" },
      { code: "PR", name: "Puerto Rico" },
      { code: "QA", name: "Qatar" },
      { code: "RE", name: "Reunion" },
      { code: "RO", name: "Romania" },
      { code: "RU", name: "Russian Federation" },
      { code: "RW", name: "Rwanda" },
      { code: "KN", name: "Saint Kitts and Nevis" },
      { code: "LC", name: "Saint Lucia" },
      { code: "VC", name: "Saint Vincent and the Grenadines" },
      { code: "WS", name: "Samoa" },
      { code: "SM", name: "San Marino" },
      { code: "ST", name: "Sao Tome and Principe" },
      { code: "SA", name: "Saudi Arabia" },
      { code: "SN", name: "Senegal" },
      { code: "RS", name: "Serbia" },
      { code: "SC", name: "Seychelles" },
      { code: "SL", name: "Sierra Leone" },
      { code: "SG", name: "Singapore" },
      { code: "SK", name: "Slovakia" },
      { code: "SI", name: "Slovenia" },
      { code: "SB", name: "Solomon Islands" },
      { code: "SO", name: "Somalia" },
      { code: "ZA", name: "South Africa" },
      { code: "GS", name: "South Georgia South Sandwich Islands" },
      { code: "SS", name: "South Sudan" },
      { code: "ES", name: "Spain" },
      { code: "LK", name: "Sri Lanka" },
      { code: "SH", name: "St. Helena" },
      { code: "PM", name: "St. Pierre and Miquelon" },
      { code: "SD", name: "Sudan" },
      { code: "SR", name: "Suriname" },
      { code: "SJ", name: "Svalbard and Jan Mayen Islands" },
      { code: "SZ", name: "Swaziland" },
      { code: "SE", name: "Sweden" },
      { code: "CH", name: "Switzerland" },
      { code: "SY", name: "Syrian Arab Republic" },
      { code: "TW", name: "Taiwan" },
      { code: "TJ", name: "Tajikistan" },
      { code: "TZ", name: "Tanzania, United Republic of" },
      { code: "TH", name: "Thailand" },
      { code: "TG", name: "Togo" },
      { code: "TK", name: "Tokelau" },
      { code: "TO", name: "Tonga" },
      { code: "TT", name: "Trinidad and Tobago" },
      { code: "TN", name: "Tunisia" },
      { code: "TR", name: "Turkey" },
      { code: "TM", name: "Turkmenistan" },
      { code: "TC", name: "Turks and Caicos Islands" },
      { code: "TV", name: "Tuvalu" },
      { code: "UG", name: "Uganda" },
      { code: "UA", name: "Ukraine" },
      { code: "AE", name: "United Arab Emirates" },
      { code: "GB", name: "United Kingdom" },
      { code: "US", name: "United States" },
      { code: "UM", name: "United States minor outlying islands" },
      { code: "UY", name: "Uruguay" },
      { code: "UZ", name: "Uzbekistan" },
      { code: "VU", name: "Vanuatu" },
      { code: "VA", name: "Vatican City State" },
      { code: "VE", name: "Venezuela" },
      { code: "VN", name: "Vietnam" },
      { code: "VG", name: "Virgin Islands (British)" },
      { code: "VI", name: "Virgin Islands (U.S.)" },
      { code: "WF", name: "Wallis and Futuna Islands" },
      { code: "EH", name: "Western Sahara" },
      { code: "YE", name: "Yemen" },
      { code: "ZR", name: "Zaire" },
      { code: "ZM", name: "Zambia" },
      { code: "ZW", name: "Zimbabwe" },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
