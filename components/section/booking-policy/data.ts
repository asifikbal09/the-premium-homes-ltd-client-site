export interface RuleItem {
  number: string;
  text: string;
  boldKeywords?: string[];
  subBullets?: string[];
  link?: {
    label: string;
    href: string;
  };
}

export interface BookingPolicyData {
  eyebrow: string;
  heroTitle: string;
  heroTitleBreak: string;
  heroSubtitle: string;
  sectionTitle: string;
  sectionSubtitle: string;
  rules: RuleItem[];
  policyQuestionType: string;
}

export const SHOP_BOOKING_POLICY_DATA: BookingPolicyData = {
  eyebrow: "COMPANY POLICY / SHOP BOOKING",
  heroTitle: "Shop Booking Policy –",
  heroTitleBreak: "The Premium Homes Ltd",
  heroSubtitle:
    "Rules and regulations applicable for purchasing a shop with land from The Premium Homes Ltd., valid for all shareholders.",
  sectionTitle: "Rules Of Shop Purchasing With Land",
  sectionSubtitle:
    "The following rules and regulations govern the purchase of shops with land under The Premium Homes Ltd. All shareholders are required to read and comply with these terms in good faith.",
  policyQuestionType: "this Shop Booking Policy",
  rules: [
    {
      number: "01",
      text: "Clients can book shops according to their choice on a first-come, first-served basis.",
    },
    {
      number: "02",
      text: "The name assigned by The Premium Homes Ltd. shall be the final and unalterable name of this project or building.",
    },
    {
      number: "03",
      text: "The whole construction cost will be paid by all the shareholders in step-by-step as per the Joint Construction Agreement.",
      link: {
        label: "Get Form",
        href: "#",
      },
    },
    {
      number: "04",
      text: "If any client is unable to pay the full price of the land share within the stipulated time, his/her shop allotment will be canceled and the paid amount will be refunded after deducting the office charge as per the refund policy.",
    },
    {
      number: "05",
      text: "For an uninterrupted and faster construction, shareholders shall sign Joint Construction Agreement & Power of Attorney to construct the building with The Premium Homes Ltd.",
    },
    {
      number: "06",
      text: "The Premium Homes Ltd reserves the right to make necessary changes in the design and layout of the project at any time due to unavoidable reasons, as per concern of the shareholders. Any client requirement to change any super structure might not be entertained; but any requirement for internal architectural change could be made in a limited manner as per the consultation of our architect and approval from the Engineering & Designing Team.",
    },
    {
      number: "07",
      text: "Both parties shall endeavor to complete the whole project within ……… months from the commencement of construction work. At the end of construction, a Deed of Partition (BONTON-NAMA DOLIL) will be signed to specify the floor number and shop number.",
    },
    {
      number: "08",
      text: "It's strictly prohibited to create any other group or communication platform to avoid any kind of miscommunication and confusion.",
    },
    {
      number: "09",
      text: "Depending on the request or demand of the shareholder, the confidential documents will have to be viewed at the office or in special cases, the documents can be collected personally.",
    },
    {
      number: "10",
      text: "If the handover of shops is delayed due to force majeure (political, natural calamities, government restrictions) it should be accepted in the larger interest of the project.",
    },
    {
      number: "11",
      text: "The allocated shop can be sold to anyone. For such a case the shareholder should officially make an application to The Premium Homes Ltd. A service charge will be applicable as per Joint Construction Agreement. The new shareholder must bear the cost of ownership transfer, registration and mutation.",
    },
    {
      number: "12",
      text: "If the shareholder fails to clear the required installments within the stipulated time, a service charge of 5% shall be imposed upon the delayed payment. An additional 5% charge shall be imposed for each subsequent delayed payment. If 3 (three) installments or an equivalent amount of 3 (three) installments are outstanding during the construction period, the shop allotment shall be deemed canceled. The shareholder can either sell the property to The Premium Homes Ltd. or any third party with the consent of The Premium Homes Ltd.",
    },
    {
      number: "13",
      text: "If the shop cannot be handed over within the stipulated ………. months due to force majeure (natural calamities, epidemic, civil war, sabotage, government restrictions, etc.), or the client's failure to make timely installment payments, the next course of action shall be mutually determined by both parties. However, if the delay occurs due to negligence on the part of The Premium Homes Ltd., and the company fails to complete the construction and hand over the project within ………. months, The Premium Homes Ltd. shall be obliged to compensate the client with monthly rent for the shop based on the number of shops (belonging to that client) and prevailing market monthly rent at the time.",
    },
    {
      number: "14",
      text: "All other policies related to The Premium Homes Ltd. are available on our official website: https://dpremiumhomes.com/shop-booking",
    },
  ],
};

export const FLAT_BOOKING_POLICY_DATA: BookingPolicyData = {
  eyebrow: "COMPANY POLICY / FLAT BOOKING",
  heroTitle: "Flat Booking Policy –",
  heroTitleBreak: "The Premium Homes Ltd",
  heroSubtitle:
    "Rules and regulations applicable for purchasing a flat with land from The Premium Homes Ltd., valid for all shareholders.",
  sectionTitle: "Rules Of Flat Purchasing With Land",
  sectionSubtitle:
    "The following rules and regulations govern the purchase of flats with land under The Premium Homes Ltd. All shareholders are required to read and comply with these terms in good faith.",
  policyQuestionType: "this Flat Booking Policy",
  rules: [
    {
      number: "01",
      text: "Clients can book flats according to their choice on a first-come, first-served basis.",
    },
    {
      number: "02",
      text: "The name assigned by The Premium Homes Ltd. shall be the final and unalterable name of this project or building.",
    },
    {
      number: "03",
      text: "The whole construction cost will be paid by all the shareholders in step-by-step as per the Joint Construction Agreement.",
      link: {
        label: "Get Form",
        href: "#",
      },
    },
    {
      number: "04",
      text: "If any client is unable to pay the full price of the land share within the stipulated time, his/her flat allotment will be canceled and the paid amount will be refunded after deducting the office charge as per the refund policy.",
    },
    {
      number: "05",
      text: "For an uninterrupted and faster construction, shareholders shall sign Joint Construction Agreement & Power of Attorney to construct the building with The Premium Homes Ltd.",
    },
    {
      number: "06",
      text: "……% of the total construction cost will be paid as a service charge to The Premium Homes Ltd for implementation and supervision of construction work. The said percentage will be accepted as service charge only.",
    },
    {
      number: "07",
      text: "In case of design changes proposed by The Premium Homes Ltd:",
      subBullets: [
        "A shareholder can apply for design changes a maximum of two (2) times before the plan is approved (RAJUK or Union Parishad approval).",
        "Design changes must be applied to The Premium Homes Ltd. authorities using the official email.",
        "No changes to the structural design will be accepted.",
        "Any changes to the exterior (building's outer design) may only be made with prior approval from The Premium Homes Ltd.'s Architectural Department & Design Team, and such changes must be minimal.",
        "With approval from the Architectural Department & Design Team, interior (building's inner design) changes may be made, but only minimal ones. In such cases, no changes are allowed to toilets, kitchens, gas lines, water supply, or drainage connections.",
        "Electrical lines may be subject to minimal changes, but only with prior approval from the Architectural Department & the Design Team.",
      ],
    },
    {
      number: "08",
      text: "Both parties shall endeavor to complete the whole project within ……… months from the commencement of construction work. At the end of construction, a Deed of Partition (BONTON-NAMA DOLIL) will be signed to specify the floor number and flat number.",
    },
    {
      number: "09",
      text: "It's strictly prohibited to create any other group or communication platform to avoid any kind of miscommunication and confusion.",
    },
    {
      number: "10",
      text: "Depending on the request or demand of the shareholder, the confidential documents will have to be viewed at the office or in special cases, the documents can be collected personally.",
    },
    {
      number: "11",
      text: "If the handover of flats is delayed due to force majeure (political, natural calamities, government restrictions) it should be accepted in the larger interest of the project.",
    },
    {
      number: "12",
      text: "The allocated flat can be sold to anyone. For such a case the shareholder should officially make an application to The Premium Homes Ltd. A service charge will be applicable as per Joint Construction Agreement. The cost of ownership transfer and mutation must be borne by the seller.",
    },
    {
      number: "13",
      text: "If the shareholder fails to make payments within the stipulated time, a service charge of 5% shall be imposed upon the delayed payment. An additional 5% charge shall be imposed for each subsequent delayed payment. If 3 (three) installments or equivalent amount are outstanding during the construction period, the flat allotment shall be deemed canceled. The shareholder can either sell the property to The Premium Homes Ltd. or any third party with the concern of The Premium Homes Ltd.",
    },
    {
      number: "14",
      text: "If the flat cannot be handed over within the stipulated ……… months due to force majeure (natural calamities, epidemic, civil war, sabotage, government restrictions, etc.), or the client's failure to make timely installment payments, the next course of action shall be mutually determined by both parties. However, if the delay occurs due to negligence on the part of The Premium Homes Ltd., and the company fails to complete the construction and hand over the project within ……… months, The Premium Homes Ltd. shall be obliged to compensate the client with monthly rent for the flat based on the number of flats (belonging to that client) and prevailing market monthly rent at the time.",
    },
    {
      number: "15",
      text: "All other policies related to The Premium Homes Ltd. are available on our official website: https://dpremiumhomes.com/",
    },
  ],
};
