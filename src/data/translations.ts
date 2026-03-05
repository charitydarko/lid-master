/**
 * English translations for LiD exam questions.
 * Keyed by question ID.
 */
export const QUESTION_TRANSLATIONS: Record<
  number,
  { q: string; opts: string[]; exp: string }
> = {
  1: {
    q: "In Germany, people are allowed to openly say something against the government because...",
    opts: [
      "freedom of religion applies here.",
      "people pay taxes.",
      "people have the right to vote.",
      "freedom of speech applies here.",
    ],
    exp: "Germany guarantees freedom of expression (Meinungsfreiheit) as a fundamental right under Article 5 of the Basic Law (Grundgesetz). Citizens may publicly criticise the government without legal consequences.",
  },
  2: {
    q: "In Germany, parents can decide until their child is 14 years old whether the child attends … at school.",
    opts: [
      "history lessons",
      "religious education",
      "civics lessons",
      "language lessons",
    ],
    exp: "Religious freedom in Germany extends to education. Until age 14, parents decide whether their children take part in religious education. After 14, the child decides themselves.",
  },
  3: {
    q: "Germany is a constitutional state (Rechtsstaat). What does this mean?",
    opts: [
      "All residents and the state must abide by the laws.",
      "The state does not have to abide by the laws.",
      "Only Germans must obey the laws.",
      "The courts make the laws.",
    ],
    exp: "A Rechtsstaat means that both citizens and the state are bound by law. No one—including the government—stands above the law. This principle protects citizens from arbitrary state action.",
  },
  4: {
    q: "Which right belongs to the fundamental rights (Grundrechte) in Germany?",
    opts: [
      "The right to bear arms",
      "The law of the jungle",
      "Freedom of speech",
      "Vigilante justice",
    ],
    exp: "Freedom of expression (Meinungsfreiheit) is guaranteed by Article 5 of the Basic Law. The other options are not rights but violations of law in Germany.",
  },
  5: {
    q: "Elections in Germany are free. What does this mean?",
    opts: [
      "You may accept money in exchange for voting for a specific candidate.",
      "Only persons who have never been in prison may vote.",
      "Voters may not be influenced or forced to cast their vote in a particular way and must not face negative consequences from voting.",
      "All eligible persons must vote.",
    ],
    exp: "Free elections mean that voters make their choice without any external pressure, bribery, or fear of consequences. Voter secrecy is also guaranteed. Compulsory voting does not exist in Germany.",
  },
  6: {
    q: "In Germany, all persons subject to the law have the same legal status. What follows from this?",
    opts: [
      "Everyone must obey the same laws.",
      "They are allowed to elect the members of parliament.",
      "They have the right to vote.",
      "They are allowed to become members of a party.",
    ],
    exp: "The principle of equality before the law (Art. 3 GG) means that the same laws apply to everyone equally — regardless of origin, gender, or social status.",
  },
  7: {
    q: "In Germany the state power is divided. The separation of powers means that...",
    opts: [
      "there is only one political party.",
      "the parliament controls the government.",
      "the separation of powers into legislative, executive and judicial branches is guaranteed.",
      "the separation of church and state is guaranteed.",
    ],
    exp: "The separation of powers (Gewaltenteilung) divides state authority into three branches: legislature (parliament), executive (government), and judiciary (courts). This prevents any one body from accumulating excessive power.",
  },
  8: {
    q: "What is characteristic of a parliamentary democracy?",
    opts: [
      "The government is not elected.",
      "There is only one party.",
      "There is a multi-party system.",
      "The head of state leads the government.",
    ],
    exp: "In a parliamentary democracy like Germany, multiple parties compete for votes. The government is formed by the party or coalition holding a parliamentary majority and is accountable to parliament.",
  },
  9: {
    q: "Which of the following principles applies to Germany as a constitutional state?",
    opts: [
      "The state must respect fundamental rights.",
      "The state can act without legal basis.",
      "Only citizens have rights.",
      "Courts must follow government instructions.",
    ],
    exp: "In Germany's constitutional state, all state action must have a legal basis and must respect the fundamental rights guaranteed by the Basic Law (Grundgesetz).",
  },
  10: {
    q: "What is the German Parliament called?",
    opts: [
      "Bundesrat",
      "Bundestag",
      "Bundesregierung",
      "Bundesversammlung",
    ],
    exp: "The Bundestag is the directly elected federal parliament of Germany. It passes federal laws, elects the Federal Chancellor, and controls the government.",
  },
  11: {
    q: "What is the name of Germany's constitution?",
    opts: [
      "Reichsverfassung",
      "Staatsvertrag",
      "Grundgesetz",
      "Bundesverfassung",
    ],
    exp: "Germany's constitution is called the Grundgesetz (Basic Law). It was drafted by the Parliamentary Council in 1948–49 and came into force on 23 May 1949.",
  },
  12: {
    q: "What applies in Germany with regard to gender equality?",
    opts: [
      "Men earn more than women by law.",
      "No one may be discriminated against because of their gender.",
      "Only men may hold public office.",
      "Women must work part-time.",
    ],
    exp: "Article 3(2) of the Basic Law states: 'Men and women shall have equal rights.' Discrimination based on gender is prohibited. The state is actively obliged to promote equality.",
  },
  13: {
    q: "Which freedoms are guaranteed by Article 5 of the Basic Law?",
    opts: [
      "Freedom of the press and freedom of expression",
      "Freedom of assembly and freedom of association",
      "Freedom of religion and freedom of conscience",
      "Freedom of movement and occupational freedom",
    ],
    exp: "Article 5 of the Basic Law guarantees freedom of expression, freedom of the press, and freedom of broadcasting. These are key pillars of Germany's democratic order.",
  },
  14: {
    q: "What is the role of the Bundesrat?",
    opts: [
      "It elects the Federal President.",
      "It represents the interests of the federal states (Länder) at the federal level.",
      "It controls the Federal Constitutional Court.",
      "It appoints the Federal Chancellor.",
    ],
    exp: "The Bundesrat (Federal Council) represents the 16 German states in federal legislation. State governments participate in federal decision-making through the Bundesrat, especially on laws affecting the states.",
  },
  15: {
    q: "What is the role of the Federal President (Bundespräsident)?",
    opts: [
      "The Federal President is the highest representative of Germany.",
      "The Federal President leads the government.",
      "The Federal President is elected by the people.",
      "The Federal President commands the armed forces.",
    ],
    exp: "The Bundespräsident is Germany's head of state and highest representative. The role is largely ceremonial — signing laws, appointing ministers, and representing Germany internationally. The President is elected by the Federal Assembly (Bundesversammlung).",
  },
  59: {
    q: "How many years ago was there a Jewish community in the territory of modern Germany for the first time?",
    opts: [
      "about 300 years ago",
      "about 700 years ago",
      "about 1,150 years ago",
      "about 1,700 years ago",
    ],
    exp: "The first documented Jewish communities in German-speaking territories date back approximately 1,700 years to the Roman era — around 321 CE in Cologne.",
  },
  66: {
    q: "Which cities have the largest Jewish communities in Germany?",
    opts: [
      "Berlin and Munich",
      "Hamburg and Essen",
      "Nuremberg and Stuttgart",
      "Worms and Speyer",
    ],
    exp: "Berlin and Munich have the largest registered Jewish communities in Germany. Berlin's community numbers around 10,000 members, followed by Munich. Both cities have active cultural and religious Jewish life.",
  },
  96: {
    q: "How can someone who denies the Holocaust be punished?",
    opts: [
      "Reduction of social benefits",
      "Up to 100 hours of community service",
      "Not at all — Holocaust denial is permitted",
      "With up to five years in prison or a fine",
    ],
    exp: "Holocaust denial (Holocaustleugnung) is a criminal offence in Germany under § 130 StGB (incitement to hatred). It is punishable by up to 5 years in prison or a substantial fine.",
  },
  210: {
    q: "What happened on 17 June 1953 in the GDR?",
    opts: [
      "The ceremonial accession to the Warsaw Pact",
      "Nationwide strikes and a popular uprising",
      "The 1st SED Party Congress",
      "The first visit by Fidel Castro",
    ],
    exp: "On 17 June 1953, workers in East Germany rose up against Soviet occupation and harsh working conditions. The uprising was suppressed by Soviet tanks. The date was commemorated as a public holiday in West Germany until reunification.",
  },
  211: {
    q: "Which politician is associated with the 'Eastern Treaties' (Ostverträge)?",
    opts: [
      "Helmut Kohl",
      "Willy Brandt",
      "Mikhail Gorbachev",
      "Ludwig Erhard",
    ],
    exp: "Willy Brandt (Chancellor 1969–1974) pioneered Ostpolitik — a policy of engagement with East Germany and Eastern Europe. The Eastern Treaties normalised relations with Poland, the USSR, and East Germany, easing Cold War tensions.",
  },
  212: {
    q: "What is Germany's official name?",
    opts: [
      "Federal State Germany",
      "Federal States Germany",
      "Federal Republic of Germany",
      "Federal District Germany",
    ],
    exp: "Germany's full official name is 'Bundesrepublik Deutschland' — Federal Republic of Germany. It was established on 23 May 1949 when the Basic Law came into force.",
  },
  213: {
    q: "How many inhabitants does Germany have?",
    opts: [
      "70 million",
      "78 million",
      "84 million",
      "90 million",
    ],
    exp: "Germany has approximately 84 million inhabitants, making it the most populous country in the European Union and one of the most populous in Europe.",
  },
  214: {
    q: "What colours does the German flag have?",
    opts: [
      "black-red-gold",
      "red-white-black",
      "black-red-green",
      "black-yellow-red",
    ],
    exp: "The German flag has three horizontal stripes: black (top), red (middle), and gold/yellow (bottom). These colours symbolise unity and freedom, originating from the 1848 revolutionary movement.",
  },
  215: {
    q: "Who is referred to as the 'Chancellor of German Unity'?",
    opts: [
      "Willy Brandt",
      "Helmut Kohl",
      "Konrad Adenauer",
      "Gerhard Schröder",
    ],
    exp: "Helmut Kohl (Chancellor 1982–1998) is known as the 'Kanzler der Deutschen Einheit' for his decisive role in achieving German reunification on 3 October 1990.",
  },
};

/** Get translation for a question, or return null if unavailable */
export function getTranslation(id: number) {
  return QUESTION_TRANSLATIONS[id] ?? null;
}
