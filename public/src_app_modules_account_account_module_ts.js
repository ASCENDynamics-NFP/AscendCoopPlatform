"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_modules_account_account_module_ts"],{

/***/ 3095:
/*!**************************************!*\
  !*** ./src/app/core/data/country.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   countries: () => (/* binding */ countries),
/* harmony export */   statesProvinces: () => (/* binding */ statesProvinces)
/* harmony export */ });
/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
const countries = [{
  value: "AF",
  label: "Afghanistan"
}, {
  value: "AL",
  label: "Albania"
}, {
  value: "DZ",
  label: "Algeria"
}, {
  value: "AS",
  label: "American Samoa"
}, {
  value: "AD",
  label: "Andorra"
}, {
  value: "AO",
  label: "Angola"
}, {
  value: "AI",
  label: "Anguilla"
}, {
  value: "AQ",
  label: "Antarctica"
}, {
  value: "AG",
  label: "Antigua and Barbuda"
}, {
  value: "AR",
  label: "Argentina"
}, {
  value: "AM",
  label: "Armenia"
}, {
  value: "AW",
  label: "Aruba"
}, {
  value: "AU",
  label: "Australia"
}, {
  value: "AT",
  label: "Austria"
}, {
  value: "AZ",
  label: "Azerbaijan"
}, {
  value: "BS",
  label: "Bahamas"
}, {
  value: "BH",
  label: "Bahrain"
}, {
  value: "BD",
  label: "Bangladesh"
}, {
  value: "BB",
  label: "Barbados"
}, {
  value: "BY",
  label: "Belarus"
}, {
  value: "BE",
  label: "Belgium"
}, {
  value: "BZ",
  label: "Belize"
}, {
  value: "BJ",
  label: "Benin"
}, {
  value: "BM",
  label: "Bermuda"
}, {
  value: "BT",
  label: "Bhutan"
}, {
  value: "BO",
  label: "Bolivia"
}, {
  value: "BA",
  label: "Bosnia and Herzegovina"
}, {
  value: "BW",
  label: "Botswana"
}, {
  value: "BR",
  label: "Brazil"
}, {
  value: "IO",
  label: "British Indian Ocean Territory"
}, {
  value: "BN",
  label: "Brunei Darussalam"
}, {
  value: "BG",
  label: "Bulgaria"
}, {
  value: "BF",
  label: "Burkina Faso"
}, {
  value: "BI",
  label: "Burundi"
}, {
  value: "CV",
  label: "Cabo Verde"
}, {
  value: "KH",
  label: "Cambodia"
}, {
  value: "CM",
  label: "Cameroon"
}, {
  value: "CA",
  label: "Canada"
}, {
  value: "KY",
  label: "Cayman Islands"
}, {
  value: "CF",
  label: "Central African Republic"
}, {
  value: "TD",
  label: "Chad"
}, {
  value: "CL",
  label: "Chile"
}, {
  value: "CN",
  label: "China"
}, {
  value: "CX",
  label: "Christmas Island"
}, {
  value: "CC",
  label: "Cocos (Keeling) Islands"
}, {
  value: "CO",
  label: "Colombia"
}, {
  value: "KM",
  label: "Comoros"
}, {
  value: "CG",
  label: "Congo"
}, {
  value: "CD",
  label: "Congo, Democratic Republic of the"
}, {
  value: "CK",
  label: "Cook Islands"
}, {
  value: "CR",
  label: "Costa Rica"
}, {
  value: "CI",
  label: "Côte d'Ivoire"
}, {
  value: "HR",
  label: "Croatia"
}, {
  value: "CU",
  label: "Cuba"
}, {
  value: "CW",
  label: "Curaçao"
}, {
  value: "CY",
  label: "Cyprus"
}, {
  value: "CZ",
  label: "Czech Republic"
}, {
  value: "DK",
  label: "Denmark"
}, {
  value: "DJ",
  label: "Djibouti"
}, {
  value: "DM",
  label: "Dominica"
}, {
  value: "DO",
  label: "Dominican Republic"
}, {
  value: "EC",
  label: "Ecuador"
}, {
  value: "EG",
  label: "Egypt"
}, {
  value: "SV",
  label: "El Salvador"
}, {
  value: "GQ",
  label: "Equatorial Guinea"
}, {
  value: "ER",
  label: "Eritrea"
}, {
  value: "EE",
  label: "Estonia"
}, {
  value: "SZ",
  label: "Eswatini"
}, {
  value: "ET",
  label: "Ethiopia"
}, {
  value: "FK",
  label: "Falkland Islands (Malvinas)"
}, {
  value: "FO",
  label: "Faroe Islands"
}, {
  value: "FJ",
  label: "Fiji"
}, {
  value: "FI",
  label: "Finland"
}, {
  value: "FR",
  label: "France"
}, {
  value: "GF",
  label: "French Guiana"
}, {
  value: "PF",
  label: "French Polynesia"
}, {
  value: "TF",
  label: "French Southern Territories"
}, {
  value: "GA",
  label: "Gabon"
}, {
  value: "GM",
  label: "Gambia"
}, {
  value: "GE",
  label: "Georgia"
}, {
  value: "DE",
  label: "Germany"
}, {
  value: "GH",
  label: "Ghana"
}, {
  value: "GI",
  label: "Gibraltar"
}, {
  value: "GR",
  label: "Greece"
}, {
  value: "GL",
  label: "Greenland"
}, {
  value: "GD",
  label: "Grenada"
}, {
  value: "GP",
  label: "Guadeloupe"
}, {
  value: "GU",
  label: "Guam"
}, {
  value: "GT",
  label: "Guatemala"
}, {
  value: "GG",
  label: "Guernsey"
}, {
  value: "GN",
  label: "Guinea"
}, {
  value: "GW",
  label: "Guinea-Bissau"
}, {
  value: "GY",
  label: "Guyana"
}, {
  value: "HT",
  label: "Haiti"
}, {
  value: "HM",
  label: "Heard Island and McDonald Islands"
}, {
  value: "VA",
  label: "Holy See"
}, {
  value: "HN",
  label: "Honduras"
}, {
  value: "HK",
  label: "Hong Kong"
}, {
  value: "HU",
  label: "Hungary"
}, {
  value: "IS",
  label: "Iceland"
}, {
  value: "IN",
  label: "India"
}, {
  value: "ID",
  label: "Indonesia"
}, {
  value: "IR",
  label: "Iran, Islamic Republic of"
}, {
  value: "IQ",
  label: "Iraq"
}, {
  value: "IE",
  label: "Ireland"
}, {
  value: "IM",
  label: "Isle of Man"
}, {
  value: "IT",
  label: "Italy"
}, {
  value: "JM",
  label: "Jamaica"
}, {
  value: "JP",
  label: "Japan"
}, {
  value: "JE",
  label: "Jersey"
}, {
  value: "JO",
  label: "Jordan"
}, {
  value: "KZ",
  label: "Kazakhstan"
}, {
  value: "KE",
  label: "Kenya"
}, {
  value: "KI",
  label: "Kiribati"
}, {
  value: "KP",
  label: "Korea, Democratic People's Republic of"
}, {
  value: "KR",
  label: "Korea, Republic of"
}, {
  value: "KW",
  label: "Kuwait"
}, {
  value: "KG",
  label: "Kyrgyzstan"
}, {
  value: "LA",
  label: "Lao People's Democratic Republic"
}, {
  value: "LV",
  label: "Latvia"
}, {
  value: "LB",
  label: "Lebanon"
}, {
  value: "LS",
  label: "Lesotho"
}, {
  value: "LR",
  label: "Liberia"
}, {
  value: "LY",
  label: "Libya"
}, {
  value: "LI",
  label: "Liechtenstein"
}, {
  value: "LT",
  label: "Lithuania"
}, {
  value: "LU",
  label: "Luxembourg"
}, {
  value: "MO",
  label: "Macao"
}, {
  value: "MG",
  label: "Madagascar"
}, {
  value: "MW",
  label: "Malawi"
}, {
  value: "MY",
  label: "Malaysia"
}, {
  value: "MV",
  label: "Maldives"
}, {
  value: "ML",
  label: "Mali"
}, {
  value: "MT",
  label: "Malta"
}, {
  value: "MH",
  label: "Marshall Islands"
}, {
  value: "MQ",
  label: "Martinique"
}, {
  value: "MR",
  label: "Mauritania"
}, {
  value: "MU",
  label: "Mauritius"
}, {
  value: "YT",
  label: "Mayotte"
}, {
  value: "MX",
  label: "Mexico"
}, {
  value: "FM",
  label: "Micronesia, Federated States of"
}, {
  value: "MD",
  label: "Moldova, Republic of"
}, {
  value: "MC",
  label: "Monaco"
}, {
  value: "MN",
  label: "Mongolia"
}, {
  value: "ME",
  label: "Montenegro"
}, {
  value: "MS",
  label: "Montserrat"
}, {
  value: "MA",
  label: "Morocco"
}, {
  value: "MZ",
  label: "Mozambique"
}, {
  value: "MM",
  label: "Myanmar"
}, {
  value: "NA",
  label: "Namibia"
}, {
  value: "NR",
  label: "Nauru"
}, {
  value: "NP",
  label: "Nepal"
}, {
  value: "NL",
  label: "Netherlands"
}, {
  value: "NC",
  label: "New Caledonia"
}, {
  value: "NZ",
  label: "New Zealand"
}, {
  value: "NI",
  label: "Nicaragua"
}, {
  value: "NE",
  label: "Niger"
}, {
  value: "NG",
  label: "Nigeria"
}, {
  value: "NU",
  label: "Niue"
}, {
  value: "NF",
  label: "Norfolk Island"
}, {
  value: "MK",
  label: "North Macedonia"
}, {
  value: "MP",
  label: "Northern Mariana Islands"
}, {
  value: "NO",
  label: "Norway"
}, {
  value: "OM",
  label: "Oman"
}, {
  value: "PK",
  label: "Pakistan"
}, {
  value: "PW",
  label: "Palau"
}, {
  value: "PS",
  label: "Palestine, State of"
}, {
  value: "PA",
  label: "Panama"
}, {
  value: "PG",
  label: "Papua New Guinea"
}, {
  value: "PY",
  label: "Paraguay"
}, {
  value: "PE",
  label: "Peru"
}, {
  value: "PH",
  label: "Philippines"
}, {
  value: "PN",
  label: "Pitcairn"
}, {
  value: "PL",
  label: "Poland"
}, {
  value: "PT",
  label: "Portugal"
}, {
  value: "PR",
  label: "Puerto Rico"
}, {
  value: "QA",
  label: "Qatar"
}, {
  value: "RE",
  label: "Réunion"
}, {
  value: "RO",
  label: "Romania"
}, {
  value: "RU",
  label: "Russian Federation"
}, {
  value: "RW",
  label: "Rwanda"
}, {
  value: "BL",
  label: "Saint Barthélemy"
}, {
  value: "SH",
  label: "Saint Helena, Ascension and Tristan da Cunha"
}, {
  value: "KN",
  label: "Saint Kitts and Nevis"
}, {
  value: "LC",
  label: "Saint Lucia"
}, {
  value: "MF",
  label: "Saint Martin (French part)"
}, {
  value: "PM",
  label: "Saint Pierre and Miquelon"
}, {
  value: "VC",
  label: "Saint Vincent and the Grenadines"
}, {
  value: "WS",
  label: "Samoa"
}, {
  value: "SM",
  label: "San Marino"
}, {
  value: "ST",
  label: "Sao Tome and Principe"
}, {
  value: "SA",
  label: "Saudi Arabia"
}, {
  value: "SN",
  label: "Senegal"
}, {
  value: "RS",
  label: "Serbia"
}, {
  value: "SC",
  label: "Seychelles"
}, {
  value: "SL",
  label: "Sierra Leone"
}, {
  value: "SG",
  label: "Singapore"
}, {
  value: "SX",
  label: "Sint Maarten (Dutch part)"
}, {
  value: "SK",
  label: "Slovakia"
}, {
  value: "SI",
  label: "Slovenia"
}, {
  value: "SB",
  label: "Solomon Islands"
}, {
  value: "SO",
  label: "Somalia"
}, {
  value: "ZA",
  label: "South Africa"
}, {
  value: "GS",
  label: "South Georgia and the South Sandwich Islands"
}, {
  value: "SS",
  label: "South Sudan"
}, {
  value: "ES",
  label: "Spain"
}, {
  value: "LK",
  label: "Sri Lanka"
}, {
  value: "SD",
  label: "Sudan"
}, {
  value: "SR",
  label: "Suriname"
}, {
  value: "SJ",
  label: "Svalbard and Jan Mayen"
}, {
  value: "SE",
  label: "Sweden"
}, {
  value: "CH",
  label: "Switzerland"
}, {
  value: "SY",
  label: "Syrian Arab Republic"
}, {
  value: "TW",
  label: "Taiwan, Province of China"
}, {
  value: "TJ",
  label: "Tajikistan"
}, {
  value: "TZ",
  label: "Tanzania, United Republic of"
}, {
  value: "TH",
  label: "Thailand"
}, {
  value: "TL",
  label: "Timor-Leste"
}, {
  value: "TG",
  label: "Togo"
}, {
  value: "TK",
  label: "Tokelau"
}, {
  value: "TO",
  label: "Tonga"
}, {
  value: "TT",
  label: "Trinidad and Tobago"
}, {
  value: "TN",
  label: "Tunisia"
}, {
  value: "TR",
  label: "Turkey"
}, {
  value: "TM",
  label: "Turkmenistan"
}, {
  value: "TC",
  label: "Turks and Caicos Islands"
}, {
  value: "TV",
  label: "Tuvalu"
}, {
  value: "UG",
  label: "Uganda"
}, {
  value: "UA",
  label: "Ukraine"
}, {
  value: "AE",
  label: "United Arab Emirates"
}, {
  value: "GB",
  label: "United Kingdom of Great Britain and Northern Ireland"
}, {
  value: "UM",
  label: "United States Minor Outlying Islands"
}, {
  value: "US",
  label: "United States of America"
}, {
  value: "UY",
  label: "Uruguay"
}, {
  value: "UZ",
  label: "Uzbekistan"
}, {
  value: "VU",
  label: "Vanuatu"
}, {
  value: "VE",
  label: "Venezuela, Bolivarian Republic of"
}, {
  value: "VN",
  label: "Viet Nam"
}, {
  value: "VG",
  label: "Virgin Islands (British)"
}, {
  value: "VI",
  label: "Virgin Islands (U.S.)"
}, {
  value: "WF",
  label: "Wallis and Futuna"
}, {
  value: "EH",
  label: "Western Sahara"
}, {
  value: "YE",
  label: "Yemen"
}, {
  value: "ZM",
  label: "Zambia"
}, {
  value: "ZW",
  label: "Zimbabwe"
}];
const statesProvinces = [{
  value: "AL",
  label: "Alabama"
}, {
  value: "AK",
  label: "Alaska"
}, {
  value: "AZ",
  label: "Arizona"
}, {
  value: "AR",
  label: "Arkansas"
}, {
  value: "CA",
  label: "California"
}, {
  value: "CO",
  label: "Colorado"
}, {
  value: "CT",
  label: "Connecticut"
}, {
  value: "DE",
  label: "Delaware"
}, {
  value: "FL",
  label: "Florida"
}, {
  value: "GA",
  label: "Georgia"
}, {
  value: "HI",
  label: "Hawaii"
}, {
  value: "ID",
  label: "Idaho"
}, {
  value: "IL",
  label: "Illinois"
}, {
  value: "IN",
  label: "Indiana"
}, {
  value: "IA",
  label: "Iowa"
}, {
  value: "KS",
  label: "Kansas"
}, {
  value: "KY",
  label: "Kentucky"
}, {
  value: "LA",
  label: "Louisiana"
}, {
  value: "ME",
  label: "Maine"
}, {
  value: "MD",
  label: "Maryland"
}, {
  value: "MA",
  label: "Massachusetts"
}, {
  value: "MI",
  label: "Michigan"
}, {
  value: "MN",
  label: "Minnesota"
}, {
  value: "MS",
  label: "Mississippi"
}, {
  value: "MO",
  label: "Missouri"
}, {
  value: "MT",
  label: "Montana"
}, {
  value: "NE",
  label: "Nebraska"
}, {
  value: "NV",
  label: "Nevada"
}, {
  value: "NH",
  label: "New Hampshire"
}, {
  value: "NJ",
  label: "New Jersey"
}, {
  value: "NM",
  label: "New Mexico"
}, {
  value: "NY",
  label: "New York"
}, {
  value: "NC",
  label: "North Carolina"
}, {
  value: "ND",
  label: "North Dakota"
}, {
  value: "OH",
  label: "Ohio"
}, {
  value: "OK",
  label: "Oklahoma"
}, {
  value: "OR",
  label: "Oregon"
}, {
  value: "PA",
  label: "Pennsylvania"
}, {
  value: "RI",
  label: "Rhode Island"
}, {
  value: "SC",
  label: "South Carolina"
}, {
  value: "SD",
  label: "South Dakota"
}, {
  value: "TN",
  label: "Tennessee"
}, {
  value: "TX",
  label: "Texas"
}, {
  value: "UT",
  label: "Utah"
}, {
  value: "VT",
  label: "Vermont"
}, {
  value: "VA",
  label: "Virginia"
}, {
  value: "WA",
  label: "Washington"
}, {
  value: "WV",
  label: "West Virginia"
}, {
  value: "WI",
  label: "Wisconsin"
}, {
  value: "WY",
  label: "Wyoming"
}, {
  value: "AB",
  label: "Alberta"
}, {
  value: "BC",
  label: "British Columbia"
}, {
  value: "MB",
  label: "Manitoba"
}, {
  value: "NB",
  label: "New Brunswick"
}, {
  value: "NL",
  label: "Newfoundland and Labrador"
}, {
  value: "NS",
  label: "Nova Scotia"
}, {
  value: "ON",
  label: "Ontario"
}, {
  value: "PE",
  label: "Prince Edward Island"
}, {
  value: "QC",
  label: "Quebec"
}, {
  value: "SK",
  label: "Saskatchewan"
}, {
  value: "NT",
  label: "Northwest Territories"
}, {
  value: "NU",
  label: "Nunavut"
}, {
  value: "YT",
  label: "Yukon"
}];

/***/ }),

/***/ 3115:
/*!**************************************!*\
  !*** ./src/app/core/data/options.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   advocacyAreasOptions: () => (/* binding */ advocacyAreasOptions),
/* harmony export */   areasOfInterestOptions: () => (/* binding */ areasOfInterestOptions),
/* harmony export */   communityAffiliationsOptions: () => (/* binding */ communityAffiliationsOptions),
/* harmony export */   groupsOrForumsOptions: () => (/* binding */ groupsOrForumsOptions),
/* harmony export */   laborRightsExperienceOptions: () => (/* binding */ laborRightsExperienceOptions),
/* harmony export */   servicesOptions: () => (/* binding */ servicesOptions),
/* harmony export */   skillsOptions: () => (/* binding */ skillsOptions)
/* harmony export */ });
/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
const areasOfInterestOptions = ["Advocacy & Human Rights", "Animals", "Arts & Culture", "Children & Youth", "Community", "Community Service", "Computers & Technology", "Crisis Support", "Disaster Relief", "Education & Literacy", "Employment", "Environment", "Faith-Based", "Health & Medicine", "Healthcare", "Homeless & Housing", "Hunger", "Immigrants & Refugees", "Justice & Legal", "LGBTQ+", "Media & Broadcasting", "Mental Health", "Music", "People with Disabilities", "Politics", "Public Safety", "Race & Ethnicity", "Science & Research", "Seniors", "Sports & Recreation", "Technology", "Transportation", "Veterans & Military Families", "Women"];
const skillsOptions = ["Accounting", "Administrative Support", "Analytics", "Architecture", "Art Direction", "Audio Engineering", "Automotive Repair", "Banking", "Biotechnology", "Bookkeeping", "Brand Management", "Business Analysis", "Business Development", "Carpentry", "Civil Engineering", "Cloud Computing", "Communications", "Compliance", "Construction Management", "Consulting", "Content Creation", "Copywriting", "Corporate Strategy", "Counseling", "Customer Service", "Data Analysis", "Data Entry", "Data Science", "Digital Marketing", "E-commerce", "Economics", "Education & Training", "Electrical Engineering", "Engineering", "Event Planning", "Executive Management", "Facilities Management", "Fashion Design", "Finance", "Financial Analysis", "Graphic Design", "Healthcare Management", "Human Resources", "Industrial Design", "Information Security", "IT Support", "Journalism", "Landscaping", "Law", "Leadership", "Legal Research", "Logistics", "Machine Learning", "Manufacturing", "Marketing", "Mechanical Engineering", "Medical Research", "Mental Health", "Music Production", "Network Administration", "Nursing", "Operations Management", "Organizational Development", "Pharmaceuticals", "Photography", "Product Design", "Product Management", "Programming", "Project Management", "Psychology", "Public Relations", "Quality Assurance", "Real Estate", "Recruiting", "Research", "Retail Management", "Risk Management", "Sales", "Scientific Research", "SEO", "Social Media Management", "Software Development", "Sports Management", "Strategic Planning", "Supply Chain Management", "Surveying", "Teaching", "Technical Support", "Technical Writing", "Training & Development", "Translation", "Travel Coordination", "Urban Planning", "UX/UI Design", "Video Production", "Web Development", "Writing & Editing"];
/* Mutual Aid Community Options */
const servicesOptions = ["Childcare", "Community Outreach", "Counseling Services", "Disability Services", "Domestic Violence Support", "Education", "Elderly Care", "Emergency Response", "Environmental Conservation", "Financial Assistance", "Food Distribution", "Healthcare", "Housing Assistance", "Job Placement", "Language Translation Services", "Legal Aid", "Mental Health Services", "Recreational Activities", "Refugee Support", "Substance Abuse Programs", "Technology Training", "Transportation", "Tutoring and Mentoring", "Youth Development Programs"];
const communityAffiliationsOptions = ["Animal Rescue Organization", "Arts and Crafts Group", "Business Improvement District", "Chamber of Commerce", "Community Center", "Cultural Group", "Educational Institution", "Environmental Organization", "Food Bank", "Health and Wellness Organization", "Library Group", "Local Non-Profit", "Neighborhood Association", "Online Community", "Parent-Teacher Association", "Professional Association", "Religious Organization", "Rotary Club", "Scout Troop", "Senior Citizen Group", "Sports Club", "Support Group", "Veterans Group", "Volunteer Fire Department", "Youth Group"];
const groupsOrForumsOptions = ["Clubhouse Rooms", "Community Boards", "Discord Servers", "Facebook Groups", "Google Groups", "Instagram Communities", "LinkedIn Groups", "Local Forums", "Meetup Groups", "Neighborhood Apps", "Online Courses", "Pinterest Boards", "Professional Networks", "Quora Spaces", "Reddit", "Slack Channels", "Snapchat Groups", "Special Interest Groups", "Telegram Groups", "TikTok Communities", "Tumblr Communities", "Twitter Spaces", "Webinars and Workshops", "WhatsApp Groups", "Yahoo Groups"];
/* Labor Rights */
const advocacyAreasOptions = ["Animal Rights", "Anti-Racism", "Anti-Trafficking", "Children's Rights", "Climate Change", "Consumer Protection", "Criminal Justice Reform", "Cultural Preservation", "Disability Rights", "Disaster Relief", "Drug Policy Reform", "Economic Justice", "Education", "Elderly Care Advocacy", "Environment", "Fair Trade", "Food Security", "Freedom of Speech", "Gun Control", "Healthcare", "Housing Rights", "Human Rights", "Immigrant Rights", "Internet Freedom", "Labor Rights", "LGBTQ+ Rights", "Media and Press Freedom", "Mental Health Advocacy", "Poverty Alleviation", "Prisoner Rights", "Public Health", "Public Safety", "Refugee Support", "Sexual Assault Awareness", "Substance Abuse Recovery", "Technology", "Transportation Equity", "Veteran Support", "Voting Rights", "Women's Rights", "Workplace Safety", "Youth Empowerment"];
const laborRightsExperienceOptions = ["None", "Beginner", "Intermediate", "Expert"];

/***/ }),

/***/ 2985:
/*!************************************!*\
  !*** ./src/app/core/data/phone.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   countryCodes: () => (/* binding */ countryCodes)
/* harmony export */ });
/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
const countryCodes = [{
  value: "+1",
  label: "+1 (USA, Canada)"
}, {
  value: "+44",
  label: "+44 (UK)"
}, {
  value: "+61",
  label: "+61 (Australia)"
}, {
  value: "+91",
  label: "+91 (India)"
}, {
  value: "+81",
  label: "+81 (Japan)"
}, {
  value: "+49",
  label: "+49 (Germany)"
}, {
  value: "+33",
  label: "+33 (France)"
}, {
  value: "+55",
  label: "+55 (Brazil)"
}, {
  value: "+39",
  label: "+39 (Italy)"
}, {
  value: "+7",
  label: "+7 (Russia)"
}, {
  value: "+86",
  label: "+86 (China)"
}, {
  value: "+34",
  label: "+34 (Spain)"
}, {
  value: "+31",
  label: "+31 (Netherlands)"
}, {
  value: "+27",
  label: "+27 (South Africa)"
}, {
  value: "+82",
  label: "+82 (South Korea)"
}, {
  value: "+65",
  label: "+65 (Singapore)"
}, {
  value: "+47",
  label: "+47 (Norway)"
}, {
  value: "+46",
  label: "+46 (Sweden)"
}, {
  value: "+45",
  label: "+45 (Denmark)"
}, {
  value: "+358",
  label: "+358 (Finland)"
}, {
  value: "+64",
  label: "+64 (New Zealand)"
}, {
  value: "+60",
  label: "+60 (Malaysia)"
}, {
  value: "+63",
  label: "+63 (Philippines)"
}, {
  value: "+92",
  label: "+92 (Pakistan)"
}, {
  value: "+880",
  label: "+880 (Bangladesh)"
}, {
  value: "+20",
  label: "+20 (Egypt)"
}, {
  value: "+234",
  label: "+234 (Nigeria)"
}, {
  value: "+966",
  label: "+966 (Saudi Arabia)"
}, {
  value: "+971",
  label: "+971 (United Arab Emirates)"
}, {
  value: "+90",
  label: "+90 (Turkey)"
}, {
  value: "+30",
  label: "+30 (Greece)"
}, {
  value: "+32",
  label: "+32 (Belgium)"
}, {
  value: "+52",
  label: "+52 (Mexico)"
}, {
  value: "+54",
  label: "+54 (Argentina)"
}, {
  value: "+57",
  label: "+57 (Colombia)"
}, {
  value: "+58",
  label: "+58 (Venezuela)"
}, {
  value: "+351",
  label: "+351 (Portugal)"
}, {
  value: "+353",
  label: "+353 (Ireland)"
}, {
  value: "+354",
  label: "+354 (Iceland)"
}, {
  value: "+358",
  label: "+358 (Finland)"
}, {
  value: "+359",
  label: "+359 (Bulgaria)"
}, {
  value: "+370",
  label: "+370 (Lithuania)"
}, {
  value: "+371",
  label: "+371 (Latvia)"
}, {
  value: "+372",
  label: "+372 (Estonia)"
}, {
  value: "+373",
  label: "+373 (Moldova)"
}, {
  value: "+374",
  label: "+374 (Armenia)"
}, {
  value: "+375",
  label: "+375 (Belarus)"
}, {
  value: "+376",
  label: "+376 (Andorra)"
}, {
  value: "+377",
  label: "+377 (Monaco)"
}, {
  value: "+378",
  label: "+378 (San Marino)"
}, {
  value: "+379",
  label: "+379 (Vatican City)"
}, {
  value: "+380",
  label: "+380 (Ukraine)"
}, {
  value: "+381",
  label: "+381 (Serbia)"
}, {
  value: "+382",
  label: "+382 (Montenegro)"
}, {
  value: "+383",
  label: "+383 (Kosovo)"
}, {
  value: "+385",
  label: "+385 (Croatia)"
}, {
  value: "+386",
  label: "+386 (Slovenia)"
}, {
  value: "+387",
  label: "+387 (Bosnia and Herzegovina)"
}, {
  value: "+389",
  label: "+389 (North Macedonia)"
}, {
  value: "+420",
  label: "+420 (Czech Republic)"
}, {
  value: "+421",
  label: "+421 (Slovakia)"
}, {
  value: "+423",
  label: "+423 (Liechtenstein)"
}, {
  value: "+500",
  label: "+500 (Falkland Islands)"
}, {
  value: "+501",
  label: "+501 (Belize)"
}, {
  value: "+502",
  label: "+502 (Guatemala)"
}, {
  value: "+503",
  label: "+503 (El Salvador)"
}, {
  value: "+504",
  label: "+504 (Honduras)"
}, {
  value: "+505",
  label: "+505 (Nicaragua)"
}, {
  value: "+506",
  label: "+506 (Costa Rica)"
}, {
  value: "+507",
  label: "+507 (Panama)"
}, {
  value: "+508",
  label: "+508 (Saint Pierre and Miquelon)"
}, {
  value: "+509",
  label: "+509 (Haiti)"
}, {
  value: "+590",
  label: "+590 (Guadeloupe)"
}, {
  value: "+591",
  label: "+591 (Bolivia)"
}, {
  value: "+592",
  label: "+592 (Guyana)"
}, {
  value: "+593",
  label: "+593 (Ecuador)"
}, {
  value: "+594",
  label: "+594 (French Guiana)"
}, {
  value: "+595",
  label: "+595 (Paraguay)"
}, {
  value: "+596",
  label: "+596 (Martinique)"
}, {
  value: "+597",
  label: "+597 (Suriname)"
}, {
  value: "+598",
  label: "+598 (Uruguay)"
}, {
  value: "+599",
  label: "+599 (Netherlands Antilles)"
}, {
  value: "+670",
  label: "+670 (East Timor)"
}, {
  value: "+672",
  label: "+672 (Norfolk Island)"
}, {
  value: "+673",
  label: "+673 (Brunei)"
}, {
  value: "+674",
  label: "+674 (Nauru)"
}, {
  value: "+675",
  label: "+675 (Papua New Guinea)"
}, {
  value: "+676",
  label: "+676 (Tonga)"
}, {
  value: "+677",
  label: "+677 (Solomon Islands)"
}, {
  value: "+678",
  label: "+678 (Vanuatu)"
}, {
  value: "+679",
  label: "+679 (Fiji)"
}, {
  value: "+680",
  label: "+680 (Palau)"
}, {
  value: "+681",
  label: "+681 (Wallis and Futuna)"
}, {
  value: "+682",
  label: "+682 (Cook Islands)"
}, {
  value: "+683",
  label: "+683 (Niue)"
}, {
  value: "+685",
  label: "+685 (Samoa)"
}, {
  value: "+686",
  label: "+686 (Kiribati)"
}, {
  value: "+687",
  label: "+687 (New Caledonia)"
}, {
  value: "+688",
  label: "+688 (Tuvalu)"
}, {
  value: "+689",
  label: "+689 (French Polynesia)"
}, {
  value: "+690",
  label: "+690 (Tokelau)"
}, {
  value: "+691",
  label: "+691 (Micronesia)"
}, {
  value: "+692",
  label: "+692 (Marshall Islands)"
}, {
  value: "+850",
  label: "+850 (North Korea)"
}, {
  value: "+852",
  label: "+852 (Hong Kong)"
}, {
  value: "+853",
  label: "+853 (Macau)"
}, {
  value: "+855",
  label: "+855 (Cambodia)"
}, {
  value: "+856",
  label: "+856 (Laos)"
}, {
  value: "+880",
  label: "+880 (Bangladesh)"
}, {
  value: "+886",
  label: "+886 (Taiwan)"
}, {
  value: "+960",
  label: "+960 (Maldives)"
}, {
  value: "+961",
  label: "+961 (Lebanon)"
}, {
  value: "+962",
  label: "+962 (Jordan)"
}, {
  value: "+963",
  label: "+963 (Syria)"
}, {
  value: "+964",
  label: "+964 (Iraq)"
}, {
  value: "+965",
  label: "+965 (Kuwait)"
}, {
  value: "+966",
  label: "+966 (Saudi Arabia)"
}, {
  value: "+967",
  label: "+967 (Yemen)"
}, {
  value: "+968",
  label: "+968 (Oman)"
}, {
  value: "+970",
  label: "+970 (Palestine)"
}, {
  value: "+971",
  label: "+971 (United Arab Emirates)"
}, {
  value: "+973",
  label: "+973 (Bahrain)"
}, {
  value: "+974",
  label: "+974 (Qatar)"
}, {
  value: "+975",
  label: "+975 (Bhutan)"
}, {
  value: "+976",
  label: "+976 (Mongolia)"
}, {
  value: "+977",
  label: "+977 (Nepal)"
}, {
  value: "+992",
  label: "+992 (Tajikistan)"
}, {
  value: "+993",
  label: "+993 (Turkmenistan)"
}, {
  value: "+994",
  label: "+994 (Azerbaijan)"
}, {
  value: "+995",
  label: "+995 (Georgia)"
}, {
  value: "+996",
  label: "+996 (Kyrgyzstan)"
}, {
  value: "+998",
  label: "+998 (Uzbekistan)"
}];

/***/ }),

/***/ 9604:
/*!***********************************************************!*\
  !*** ./src/app/modules/account/account-routing.module.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccountRoutingModule: () => (/* binding */ AccountRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core/guards/auth.guard */ 4978);
/* harmony import */ var _pages_details_details_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pages/details/details.page */ 9263);
/* harmony import */ var _pages_edit_edit_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/edit/edit.page */ 5221);
/* harmony import */ var _pages_registration_registration_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/registration/registration.page */ 8239);
/* harmony import */ var _pages_group_list_group_list_page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pages/group-list/group-list.page */ 1209);
/* harmony import */ var _pages_settings_settings_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pages/settings/settings.page */ 7911);
/* harmony import */ var _pages_users_users_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pages/users/users.page */ 3399);
/* harmony import */ var _relatedAccount_pages_list_list_page__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./relatedAccount/pages/list/list.page */ 4096);
/* harmony import */ var _relatedListings_pages_listings_list_listings_list_page__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./relatedListings/pages/listings-list/listings-list.page */ 3492);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 6623);
var _AccountRoutingModule;












const routes = [{
  path: "group-list",
  component: _pages_group_list_group_list_page__WEBPACK_IMPORTED_MODULE_4__.GroupListPage
}, {
  path: "settings",
  component: _pages_settings_settings_page__WEBPACK_IMPORTED_MODULE_5__.SettingsPage,
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
}, {
  path: "users",
  component: _pages_users_users_page__WEBPACK_IMPORTED_MODULE_6__.UsersPage,
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
}, {
  path: "registration/:accountId",
  component: _pages_registration_registration_page__WEBPACK_IMPORTED_MODULE_3__.RegistrationPage,
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
}, {
  path: ":accountId",
  component: _pages_details_details_page__WEBPACK_IMPORTED_MODULE_1__.DetailsPage,
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
}, {
  path: ":accountId/edit",
  component: _pages_edit_edit_page__WEBPACK_IMPORTED_MODULE_2__.EditPage,
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
}, {
  path: ":accountId/listings",
  component: _relatedListings_pages_listings_list_listings_list_page__WEBPACK_IMPORTED_MODULE_8__.ListingsListPage,
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
}, {
  path: ":accountId/related/:listType",
  component: _relatedAccount_pages_list_list_page__WEBPACK_IMPORTED_MODULE_7__.ListPage,
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
}];
class AccountRoutingModule {}
_AccountRoutingModule = AccountRoutingModule;
_AccountRoutingModule.ɵfac = function AccountRoutingModule_Factory(t) {
  return new (t || _AccountRoutingModule)();
};
_AccountRoutingModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineNgModule"]({
  type: _AccountRoutingModule
});
_AccountRoutingModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineInjector"]({
  imports: [_angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterModule.forChild(routes), _angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterModule]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsetNgModuleScope"](AccountRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterModule]
  });
})();

/***/ }),

/***/ 1797:
/*!***************************************************!*\
  !*** ./src/app/modules/account/account.module.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccountModule: () => (/* binding */ AccountModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _pages_settings_settings_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pages/settings/settings.page */ 7911);
/* harmony import */ var _pages_settings_components_settings_settings_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pages/settings/components/settings/settings.component */ 4584);
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/shared.module */ 3887);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! @ngx-translate/core */ 7353);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! @ngrx/effects */ 1996);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _state_effects_account_effects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../state/effects/account.effects */ 4862);
/* harmony import */ var _state_reducers_account_reducer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../state/reducers/account.reducer */ 1497);
/* harmony import */ var _pages_details_components_contact_information_contact_information_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pages/details/components/contact-information/contact-information.component */ 2293);
/* harmony import */ var _pages_details_components_hero_hero_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pages/details/components/hero/hero.component */ 5295);
/* harmony import */ var _pages_details_components_mutual_aid_community_info_mutual_aid_community_info_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pages/details/components/mutual-aid-community-info/mutual-aid-community-info.component */ 9417);
/* harmony import */ var _pages_details_components_professional_info_professional_info_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pages/details/components/professional-info/professional-info.component */ 5933);
/* harmony import */ var _pages_details_components_profile_profile_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./pages/details/components/profile/profile.component */ 5521);
/* harmony import */ var _pages_details_components_related_accounts_related_accounts_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./pages/details/components/related-accounts/related-accounts.component */ 9803);
/* harmony import */ var _pages_details_components_volunteer_preference_info_volunteer_preference_info_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./pages/details/components/volunteer-preference-info/volunteer-preference-info.component */ 9949);
/* harmony import */ var _pages_details_details_page__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./pages/details/details.page */ 9263);
/* harmony import */ var _pages_edit_components_contact_info_form_contact_info_form_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./pages/edit/components/contact-info-form/contact-info-form.component */ 59);
/* harmony import */ var _pages_edit_edit_page__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./pages/edit/edit.page */ 5221);
/* harmony import */ var _pages_edit_components_basic_info_form_basic_info_form_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./pages/edit/components/basic-info-form/basic-info-form.component */ 4031);
/* harmony import */ var _pages_edit_components_edit_menu_edit_menu_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./pages/edit/components/edit-menu/edit-menu.component */ 2515);
/* harmony import */ var _pages_edit_components_mutual_aid_community_engagement_form_mutual_aid_community_engagement_form_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./pages/edit/components/mutual-aid-community-engagement-form/mutual-aid-community-engagement-form.component */ 7797);
/* harmony import */ var _pages_edit_components_labor_rights_info_form_labor_rights_info_form_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./pages/edit/components/labor-rights-info-form/labor-rights-info-form.component */ 2609);
/* harmony import */ var _pages_edit_components_professional_info_form_professional_info_form_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./pages/edit/components/professional-info-form/professional-info-form.component */ 1923);
/* harmony import */ var _pages_edit_components_volunteer_preference_info_form_volunteer_preference_info_form_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./pages/edit/components/volunteer-preference-info-form/volunteer-preference-info-form.component */ 521);
/* harmony import */ var _account_routing_module__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./account-routing.module */ 9604);
/* harmony import */ var _pages_registration_registration_page__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./pages/registration/registration.page */ 8239);
/* harmony import */ var _pages_registration_components_group_registration_group_registration_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./pages/registration/components/group-registration/group-registration.component */ 5532);
/* harmony import */ var _pages_registration_components_user_registration_user_registration_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./pages/registration/components/user-registration/user-registration.component */ 4460);
/* harmony import */ var _pages_group_list_group_list_page__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./pages/group-list/group-list.page */ 1209);
/* harmony import */ var _pages_users_users_page__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./pages/users/users.page */ 3399);
/* harmony import */ var _relatedAccount_pages_list_list_page__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./relatedAccount/pages/list/list.page */ 4096);
/* harmony import */ var _pages_details_components_related_listings_related_listings_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./pages/details/components/related-listings/related-listings.component */ 5445);
/* harmony import */ var _relatedListings_pages_listings_list_listings_list_page__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./relatedListings/pages/listings-list/listings-list.page */ 3492);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @angular/core */ 6623);
var _AccountModule;








































class AccountModule {}
_AccountModule = AccountModule;
_AccountModule.ɵfac = function AccountModule_Factory(t) {
  return new (t || _AccountModule)();
};
_AccountModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_30__["ɵɵdefineNgModule"]({
  type: _AccountModule
});
_AccountModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_30__["ɵɵdefineInjector"]({
  imports: [_account_routing_module__WEBPACK_IMPORTED_MODULE_21__.AccountRoutingModule, _angular_common__WEBPACK_IMPORTED_MODULE_31__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_32__.FormsModule, _ionic_angular__WEBPACK_IMPORTED_MODULE_33__.IonicModule, _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__.SharedModule, _angular_router__WEBPACK_IMPORTED_MODULE_34__.RouterModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_35__.TranslateModule, _angular_forms__WEBPACK_IMPORTED_MODULE_32__.ReactiveFormsModule, _ngrx_store__WEBPACK_IMPORTED_MODULE_36__.StoreModule.forFeature("accounts", _state_reducers_account_reducer__WEBPACK_IMPORTED_MODULE_4__.accountReducer), _ngrx_effects__WEBPACK_IMPORTED_MODULE_37__.EffectsModule.forFeature([_state_effects_account_effects__WEBPACK_IMPORTED_MODULE_3__.AccountEffects])]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_30__["ɵɵsetNgModuleScope"](AccountModule, {
    declarations: [_pages_settings_settings_page__WEBPACK_IMPORTED_MODULE_0__.SettingsPage, _pages_settings_components_settings_settings_component__WEBPACK_IMPORTED_MODULE_1__.SettingsComponent, _pages_edit_edit_page__WEBPACK_IMPORTED_MODULE_14__.EditPage, _pages_edit_components_edit_menu_edit_menu_component__WEBPACK_IMPORTED_MODULE_16__.EditMenuComponent, _pages_edit_components_basic_info_form_basic_info_form_component__WEBPACK_IMPORTED_MODULE_15__.BasicInfoFormComponent, _pages_edit_components_contact_info_form_contact_info_form_component__WEBPACK_IMPORTED_MODULE_13__.ContactInfoFormComponent, _pages_edit_components_labor_rights_info_form_labor_rights_info_form_component__WEBPACK_IMPORTED_MODULE_18__.LaborRightsInfoFormComponent, _pages_edit_components_mutual_aid_community_engagement_form_mutual_aid_community_engagement_form_component__WEBPACK_IMPORTED_MODULE_17__.MutualAidCommunityEngagementFormComponent, _pages_details_components_contact_information_contact_information_component__WEBPACK_IMPORTED_MODULE_5__.ContactInformationComponent, _pages_edit_components_professional_info_form_professional_info_form_component__WEBPACK_IMPORTED_MODULE_19__.ProfessionalInfoFormComponent, _pages_edit_components_volunteer_preference_info_form_volunteer_preference_info_form_component__WEBPACK_IMPORTED_MODULE_20__.VolunteerPreferenceInfoFormComponent, _pages_details_details_page__WEBPACK_IMPORTED_MODULE_12__.DetailsPage, _pages_details_components_hero_hero_component__WEBPACK_IMPORTED_MODULE_6__.HeroComponent, _pages_details_components_professional_info_professional_info_component__WEBPACK_IMPORTED_MODULE_8__.ProfessionalInfoComponent, _pages_details_components_related_accounts_related_accounts_component__WEBPACK_IMPORTED_MODULE_10__.RelatedAccountsComponent, _pages_details_components_volunteer_preference_info_volunteer_preference_info_component__WEBPACK_IMPORTED_MODULE_11__.VolunteerPreferenceInfoComponent, _pages_details_components_profile_profile_component__WEBPACK_IMPORTED_MODULE_9__.ProfileComponent, _pages_details_components_mutual_aid_community_info_mutual_aid_community_info_component__WEBPACK_IMPORTED_MODULE_7__.MutualAidCommunityInfoComponent, _pages_registration_registration_page__WEBPACK_IMPORTED_MODULE_22__.RegistrationPage, _pages_registration_components_group_registration_group_registration_component__WEBPACK_IMPORTED_MODULE_23__.GroupRegistrationComponent, _pages_registration_components_user_registration_user_registration_component__WEBPACK_IMPORTED_MODULE_24__.UserRegistrationComponent, _pages_group_list_group_list_page__WEBPACK_IMPORTED_MODULE_25__.GroupListPage, _pages_users_users_page__WEBPACK_IMPORTED_MODULE_26__.UsersPage, _relatedListings_pages_listings_list_listings_list_page__WEBPACK_IMPORTED_MODULE_29__.ListingsListPage, _relatedAccount_pages_list_list_page__WEBPACK_IMPORTED_MODULE_27__.ListPage, _pages_details_components_related_listings_related_listings_component__WEBPACK_IMPORTED_MODULE_28__.RelatedListingsComponent],
    imports: [_account_routing_module__WEBPACK_IMPORTED_MODULE_21__.AccountRoutingModule, _angular_common__WEBPACK_IMPORTED_MODULE_31__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_32__.FormsModule, _ionic_angular__WEBPACK_IMPORTED_MODULE_33__.IonicModule, _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__.SharedModule, _angular_router__WEBPACK_IMPORTED_MODULE_34__.RouterModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_35__.TranslateModule, _angular_forms__WEBPACK_IMPORTED_MODULE_32__.ReactiveFormsModule, _ngrx_store__WEBPACK_IMPORTED_MODULE_36__.StoreFeatureModule, _ngrx_effects__WEBPACK_IMPORTED_MODULE_37__.EffectsFeatureModule]
  });
})();

/***/ }),

/***/ 2293:
/*!***************************************************************************************************************!*\
  !*** ./src/app/modules/account/pages/details/components/contact-information/contact-information.component.ts ***!
  \***************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContactInformationComponent: () => (/* binding */ ContactInformationComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _ContactInformationComponent;



function ContactInformationComponent_ion_button_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-button", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ContactInformationComponent_ion_button_11_Template_ion_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.toggleShow("phone"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r1.showMore.phone ? "Hide" : "Show", " More ");
  }
}
function ContactInformationComponent_div_14_p_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const phone_r3 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r1.formatPhoneNumber(phone_r3), " ");
  }
}
function ContactInformationComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, ContactInformationComponent_div_14_p_1_Template, 2, 1, "p", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r1.account == null ? null : ctx_r1.account.contactInformation == null ? null : ctx_r1.account.contactInformation.phoneNumbers == null ? null : ctx_r1.account.contactInformation.phoneNumbers.slice(1));
  }
}
function ContactInformationComponent_ion_button_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-button", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ContactInformationComponent_ion_button_18_Template_ion_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.toggleShow("email"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r1.showMore.email ? "Hide" : "Show", " More ");
  }
}
function ContactInformationComponent_div_21_p_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const email_r5 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r1.formatEmail(email_r5), " ");
  }
}
function ContactInformationComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, ContactInformationComponent_div_21_p_1_Template, 2, 1, "p", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r1.account == null ? null : ctx_r1.account.contactInformation == null ? null : ctx_r1.account.contactInformation.emails == null ? null : ctx_r1.account.contactInformation.emails.slice(1));
  }
}
function ContactInformationComponent_ion_button_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-button", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ContactInformationComponent_ion_button_25_Template_ion_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.toggleShow("address"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r1.showMore.address ? "Hide" : "Show", " More ");
  }
}
function ContactInformationComponent_div_27_p_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "p", 5);
  }
  if (rf & 2) {
    const address_r7 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("innerText", address_r7 ? ctx_r1.formatAddress(address_r7) : "-");
  }
}
function ContactInformationComponent_div_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, ContactInformationComponent_div_27_p_1_Template, 1, 1, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r1.account == null ? null : ctx_r1.account.contactInformation == null ? null : ctx_r1.account.contactInformation.addresses == null ? null : ctx_r1.account.contactInformation.addresses.slice(1));
  }
}
class ContactInformationComponent {
  constructor() {
    this.showMore = {
      phone: false,
      email: false,
      address: false
    };
  }
  get account() {
    return this._account;
  }
  set account(account) {
    if (!account) {
      return;
    }
    this._account = account;
  }
  get hasMoreThanOnePhoneNumber() {
    var _this$account;
    return ((_this$account = this.account) === null || _this$account === void 0 || (_this$account = _this$account.contactInformation) === null || _this$account === void 0 || (_this$account = _this$account.phoneNumbers) === null || _this$account === void 0 ? void 0 : _this$account.length) !== undefined && this.account.contactInformation.phoneNumbers.length > 1;
  }
  get hasMoreThanOneEmail() {
    var _this$account2;
    return ((_this$account2 = this.account) === null || _this$account2 === void 0 || (_this$account2 = _this$account2.contactInformation) === null || _this$account2 === void 0 || (_this$account2 = _this$account2.emails) === null || _this$account2 === void 0 ? void 0 : _this$account2.length) !== undefined && this.account.contactInformation.emails.length > 1;
  }
  get hasMoreThanOneAddress() {
    var _this$account3;
    return ((_this$account3 = this.account) === null || _this$account3 === void 0 || (_this$account3 = _this$account3.contactInformation) === null || _this$account3 === void 0 || (_this$account3 = _this$account3.addresses) === null || _this$account3 === void 0 ? void 0 : _this$account3.length) !== undefined && this.account.contactInformation.addresses.length > 1;
  }
  getFirstPhoneNumber() {
    var _this$account4;
    const phoneNumbers = (_this$account4 = this.account) === null || _this$account4 === void 0 || (_this$account4 = _this$account4.contactInformation) === null || _this$account4 === void 0 ? void 0 : _this$account4.phoneNumbers;
    if (!phoneNumbers || phoneNumbers.length === 0) {
      return "-";
    }
    return this.formatPhoneNumber(phoneNumbers[0]);
  }
  formatPhoneNumber(phone) {
    if (!phone.number) return "-";
    const formattedNumber = phone.number.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2-$3");
    const emergencyIndicator = phone.isEmergencyNumber ? "(E)" : "";
    return `${phone.type || ""}${emergencyIndicator}: ${phone.countryCode || ""} ${formattedNumber}`;
  }
  getFirstEmail() {
    var _this$account5;
    const emails = (_this$account5 = this.account) === null || _this$account5 === void 0 || (_this$account5 = _this$account5.contactInformation) === null || _this$account5 === void 0 ? void 0 : _this$account5.emails;
    if (!emails || emails.length === 0) {
      return "-";
    }
    return this.formatEmail(emails[0]);
  }
  formatEmail(email) {
    if (!email.email) return "-";
    return `${email.name || "-"}: ${email.email}`;
  }
  getFirstAddress() {
    var _this$account6;
    const addresses = (_this$account6 = this.account) === null || _this$account6 === void 0 || (_this$account6 = _this$account6.contactInformation) === null || _this$account6 === void 0 ? void 0 : _this$account6.addresses;
    if (!addresses || addresses.length === 0) {
      return "-";
    }
    return addresses[0] ? this.formatAddress(addresses[0]) : "-";
  }
  formatAddress(address) {
    if (!address.street) return "-";
    const primary = address.isPrimaryAddress ? "(Primary)" : "";
    return `${address.name || ""} ${primary}\n${address.street}\n${address.city || ""}, ${address.state || ""}, ${address.country || ""} ${address.zipcode || ""}`;
  }
  toggleShow(type) {
    this.showMore[type] = !this.showMore[type];
  }
}
_ContactInformationComponent = ContactInformationComponent;
_ContactInformationComponent.ɵfac = function ContactInformationComponent_Factory(t) {
  return new (t || _ContactInformationComponent)();
};
_ContactInformationComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: _ContactInformationComponent,
  selectors: [["app-contact-information"]],
  inputs: {
    account: "account"
  },
  decls: 34,
  vars: 10,
  consts: [[1, "contact-info-card"], ["size", "6"], [1, "info-block"], ["fill", "clear", "size", "small", 3, "click", 4, "ngIf"], [4, "ngIf"], [3, "innerText"], ["fill", "clear", "size", "small", 3, "click"], [4, "ngFor", "ngForOf"], [3, "innerText", 4, "ngFor", "ngForOf"]],
  template: function ContactInformationComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-card", 0)(1, "ion-card-header")(2, "ion-card-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Contact Information");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "ion-card-content")(5, "ion-grid")(6, "ion-row")(7, "ion-col", 1)(8, "div", 2)(9, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, " Phone ");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, ContactInformationComponent_ion_button_11_Template, 2, 1, "ion-button", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](14, ContactInformationComponent_div_14_Template, 2, 1, "div", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 2)(16, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, " Email Address ");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](18, ContactInformationComponent_ion_button_18_Template, 2, 1, "ion-button", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](21, ContactInformationComponent_div_21_Template, 2, 1, "div", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 2)(23, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, " Mailing Address ");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](25, ContactInformationComponent_ion_button_25_Template, 2, 1, "ion-button", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](26, "p", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](27, ContactInformationComponent_div_27_Template, 2, 1, "div", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "ion-col", 1)(29, "div", 2)(30, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "Preferred Method of Contact");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()()();
    }
    if (rf & 2) {
      let tmp_9_0;
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](11);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.hasMoreThanOnePhoneNumber);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.getFirstPhoneNumber());
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.showMore.phone);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.hasMoreThanOneEmail);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.getFirstEmail());
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.showMore.email);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.hasMoreThanOneAddress);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("innerText", ctx.getFirstAddress());
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.showMore.address);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", (tmp_9_0 = ctx.account == null ? null : ctx.account.contactInformation == null ? null : ctx.account.contactInformation.preferredMethodOfContact) !== null && tmp_9_0 !== undefined ? tmp_9_0 : "-", " ");
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonCard, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonCardContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonCardHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonCardTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonRow],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.contact-info-card[_ngcontent-%COMP%] {\n  border: 1px solid var(--ion-color-primary);\n}\n\n.contact-info-card[_ngcontent-%COMP%]   ion-card-title[_ngcontent-%COMP%] {\n  font-size: 1.5em;\n  margin-bottom: 16px;\n}\n\n.contact-info-card[_ngcontent-%COMP%]   .info-block[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n\n.contact-info-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-size: 1.2em;\n  font-weight: bold;\n  color: #000;\n  margin: 0;\n}\n.contact-info-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin-right: auto;\n  font-size: 0.8em; \n\n  padding: 0.2em 0.5em; \n\n  --padding-start: 0;\n  --padding-end: 0;\n}\n\n.contact-info-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1em;\n  margin: 4px 0 0 0;\n}\n\n@media (prefers-color-scheme: dark) {\n  .contact-info-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    color: #fff;\n  }\n  .contact-info-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    color: #aaa;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2RldGFpbHMvY29tcG9uZW50cy9jb250YWN0LWluZm9ybWF0aW9uL2NvbnRhY3QtaW5mb3JtYXRpb24uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQTtBQW1CQTtFQUNFLDBDQUFBO0FBQ0Y7O0FBRUE7RUFDRSxnQkFBQTtFQUNBLG1CQUFBO0FBQ0Y7O0FBRUE7RUFDRSxtQkFBQTtBQUNGOztBQUVBO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsOEJBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0VBQ0EsV0FBQTtFQUNBLFNBQUE7QUFDRjtBQUNFO0VBQ0Usa0JBQUE7RUFDQSxnQkFBQSxFQUFBLG1DQUFBO0VBQ0Esb0JBQUEsRUFBQSxpQ0FBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7QUFDSjs7QUFHQTtFQUNFLGNBQUE7RUFDQSxpQkFBQTtBQUFGOztBQUdBO0VBQ0U7SUFDRSxXQUFBO0VBQUY7RUFHQTtJQUNFLFdBQUE7RUFERjtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4uY29udGFjdC1pbmZvLWNhcmQge1xuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1pb24tY29sb3ItcHJpbWFyeSk7XG59XG5cbi5jb250YWN0LWluZm8tY2FyZCBpb24tY2FyZC10aXRsZSB7XG4gIGZvbnQtc2l6ZTogMS41ZW07XG4gIG1hcmdpbi1ib3R0b206IDE2cHg7XG59XG5cbi5jb250YWN0LWluZm8tY2FyZCAuaW5mby1ibG9jayB7XG4gIG1hcmdpbi1ib3R0b206IDE2cHg7XG59XG5cbi5jb250YWN0LWluZm8tY2FyZCBoMiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgZm9udC1zaXplOiAxLjJlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGNvbG9yOiAjMDAwO1xuICBtYXJnaW46IDA7XG5cbiAgaW9uLWJ1dHRvbiB7XG4gICAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xuICAgIGZvbnQtc2l6ZTogMC44ZW07IC8qIEFkanVzdCB0aGUgZm9udCBzaXplIGlmIG5lZWRlZCAqL1xuICAgIHBhZGRpbmc6IDAuMmVtIDAuNWVtOyAvKiBBZGp1c3QgdGhlIHBhZGRpbmcgaWYgbmVlZGVkICovXG4gICAgLS1wYWRkaW5nLXN0YXJ0OiAwO1xuICAgIC0tcGFkZGluZy1lbmQ6IDA7XG4gIH1cbn1cblxuLmNvbnRhY3QtaW5mby1jYXJkIHAge1xuICBmb250LXNpemU6IDFlbTtcbiAgbWFyZ2luOiA0cHggMCAwIDA7XG59XG5cbkBtZWRpYSAocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspIHtcbiAgLmNvbnRhY3QtaW5mby1jYXJkIGgyIHtcbiAgICBjb2xvcjogI2ZmZjtcbiAgfVxuXG4gIC5jb250YWN0LWluZm8tY2FyZCBwIHtcbiAgICBjb2xvcjogI2FhYTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 5295:
/*!*********************************************************************************!*\
  !*** ./src/app/modules/account/pages/details/components/hero/hero.component.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HeroComponent: () => (/* binding */ HeroComponent)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _shared_components_image_upload_modal_image_upload_modal_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../shared/components/image-upload-modal/image-upload-modal.component */ 861);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 9191);

var _HeroComponent;





function HeroComponent_ion_button_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function HeroComponent_ion_button_2_Template_ion_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r1.openImageUploadModal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "ion-icon", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, " Edit ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function HeroComponent_ion_button_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function HeroComponent_ion_button_15_Template_ion_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r1.onLink("donation"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Donate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function HeroComponent_ion_button_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "ion-icon", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, " Edit ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("routerLink", "/account/" + ctx_r1.account.id + "/edit");
  }
}
class HeroComponent {
  constructor(modalController) {
    this.modalController = modalController;
    this.isProfileOwner = false;
  }
  get hasDonationURL() {
    var _this$account$webLink;
    return ((_this$account$webLink = this.account.webLinks) === null || _this$account$webLink === void 0 ? void 0 : _this$account$webLink.some(webLink => {
      var _webLink$category;
      return (webLink === null || webLink === void 0 || (_webLink$category = webLink.category) === null || _webLink$category === void 0 ? void 0 : _webLink$category.toLowerCase()) === "donation";
    })) || false;
  }
  get getLocation() {
    var _this$account;
    if ((_this$account = this.account) !== null && _this$account !== void 0 && (_this$account = _this$account.contactInformation) !== null && _this$account !== void 0 && (_this$account = _this$account.addresses) !== null && _this$account !== void 0 && _this$account.length) {
      const address = this.account.contactInformation.addresses[0];
      return `${address === null || address === void 0 ? void 0 : address.city} / ${address === null || address === void 0 ? void 0 : address.country}`;
    }
    return "";
  }
  openImageUploadModal() {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this.account.id || !_this.isProfileOwner) return;
      const modal = yield _this.modalController.create({
        component: _shared_components_image_upload_modal_image_upload_modal_component__WEBPACK_IMPORTED_MODULE_1__.ImageUploadModalComponent,
        componentProps: {
          collectionName: "accounts",
          docId: _this.account.id,
          firestoreLocation: `accounts/${_this.account.id}/profile`,
          maxHeight: 300,
          maxWidth: 900,
          fieldName: "heroImage"
        }
      });
      yield modal.present();
    })();
  }
  onLink(category) {
    var _this$account$webLink2;
    const webLink = (_this$account$webLink2 = this.account.webLinks) === null || _this$account$webLink2 === void 0 ? void 0 : _this$account$webLink2.find(link => {
      var _link$category;
      return ((_link$category = link.category) === null || _link$category === void 0 ? void 0 : _link$category.toLowerCase()) === category.toLowerCase();
    });
    if (webLink !== null && webLink !== void 0 && webLink.url) {
      window.open(webLink.url, "_blank");
    } else {
      console.error(`No URL found for category: ${category}`);
    }
  }
}
_HeroComponent = HeroComponent;
_HeroComponent.ɵfac = function HeroComponent_Factory(t) {
  return new (t || _HeroComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_3__.ModalController));
};
_HeroComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: _HeroComponent,
  selectors: [["app-hero"]],
  inputs: {
    account: "account",
    isProfileOwner: "isProfileOwner"
  },
  decls: 17,
  vars: 8,
  consts: [[1, "header-image"], ["alt", "Header Background", 3, "src"], ["fill", "outline", "class", "edit-button", "size", "small", 3, "click", 4, "ngIf"], [1, "profile-header"], [1, "profile-info"], ["alt", "Profile Photo", 1, "profile-img", 3, "src"], [1, "profile-details"], [1, "tagline"], [1, "profile-actions"], ["color", "primary", "fill", "outline", 3, "click", 4, "ngIf"], ["color", "primary", "fill", "outline", "size", "small", 3, "routerLink", 4, "ngIf"], ["fill", "outline", "size", "small", 1, "edit-button", 3, "click"], ["name", "pencil-outline"], ["color", "primary", "fill", "outline", 3, "click"], ["color", "primary", "fill", "outline", "size", "small", 3, "routerLink"]],
  template: function HeroComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "img", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, HeroComponent_ion_button_2_Template, 3, 0, "ion-button", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 3)(4, "div", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](5, "img", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 6)(7, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "p", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "div", 8)(14, "ion-buttons");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](15, HeroComponent_ion_button_15_Template, 2, 0, "ion-button", 9)(16, HeroComponent_ion_button_16_Template, 3, 1, "ion-button", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("src", ctx.account.heroImage || "assets/image/userhero.png", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeUrl"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isProfileOwner);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("src", ctx.account.iconImage || "assets/default-profile.png", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeUrl"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx.account.name);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx.getLocation, " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx.account.tagline);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.hasDonationURL);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isProfileOwner);
    }
  },
  dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonButtons, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.RouterLinkDelegate],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.header-image[_ngcontent-%COMP%] {\n  position: relative;\n}\n.header-image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 150px;\n  object-fit: cover;\n}\n\n.profile-header[_ngcontent-%COMP%] {\n  padding: 16px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.profile-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  width: 100%;\n}\n\n.profile-img[_ngcontent-%COMP%] {\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;\n  object-fit: cover; \n\n  margin-right: 16px;\n}\n\n.profile-details[_ngcontent-%COMP%] {\n  flex-grow: 1;\n  position: relative;\n}\n\n.tagline[_ngcontent-%COMP%] {\n  color: #ffa500;\n}\n\n.profile-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: right;\n  gap: 10px;\n  margin-top: 16px;\n  width: 100%;\n}\n\n.edit-button[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  color: var(--ion-color-primary);\n  border-radius: 5%;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2RldGFpbHMvY29tcG9uZW50cy9oZXJvL2hlcm8uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQTtBQXNCQTtFQUNFLGtCQUFBO0FBRkY7QUFHRTtFQUNFLFdBQUE7RUFDQSxhQUFBO0VBQ0EsaUJBQUE7QUFESjs7QUFLQTtFQUNFLGFBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtBQUZGOztBQUtBO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsV0FBQTtBQUZGOztBQUtBO0VBQ0UsWUFBQTtFQUNBLGFBQUE7RUFDQSxrQkFBQTtFQUNBLGlCQUFBLEVBQUEsNENBQUE7RUFDQSxrQkFBQTtBQUZGOztBQUtBO0VBQ0UsWUFBQTtFQUNBLGtCQUFBO0FBRkY7O0FBS0E7RUFDRSxjQUFBO0FBRkY7O0FBS0E7RUFDRSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxTQUFBO0VBQ0EsZ0JBQUE7RUFDQSxXQUFBO0FBRkY7O0FBS0E7RUFDRSxrQkFBQTtFQUNBLFNBQUE7RUFDQSxXQUFBO0VBQ0EsK0JBQUE7RUFDQSxpQkFBQTtBQUZGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vLyBpb24taGVhZGVyIHtcbi8vICAgLS1iYWNrZ3JvdW5kOiAjMDAwO1xuLy8gfVxuLmhlYWRlci1pbWFnZSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgaW1nIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDE1MHB4O1xuICAgIG9iamVjdC1maXQ6IGNvdmVyO1xuICB9XG59XG5cbi5wcm9maWxlLWhlYWRlciB7XG4gIHBhZGRpbmc6IDE2cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5wcm9maWxlLWluZm8ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLnByb2ZpbGUtaW1nIHtcbiAgd2lkdGg6IDEwMHB4O1xuICBoZWlnaHQ6IDEwMHB4O1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIG9iamVjdC1maXQ6IGNvdmVyOyAvKiBFbnN1cmUgdGhlIGltYWdlIG1haW50YWlucyBhc3BlY3QgcmF0aW8gKi9cbiAgbWFyZ2luLXJpZ2h0OiAxNnB4O1xufVxuXG4ucHJvZmlsZS1kZXRhaWxzIHtcbiAgZmxleC1ncm93OiAxO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi50YWdsaW5lIHtcbiAgY29sb3I6ICNmZmE1MDA7XG59XG5cbi5wcm9maWxlLWFjdGlvbnMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHJpZ2h0O1xuICBnYXA6IDEwcHg7XG4gIG1hcmdpbi10b3A6IDE2cHg7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4uZWRpdC1idXR0b24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMTBweDtcbiAgcmlnaHQ6IDEwcHg7XG4gIGNvbG9yOiB2YXIoLS1pb24tY29sb3ItcHJpbWFyeSk7XG4gIGJvcmRlci1yYWRpdXM6IDUlO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 9417:
/*!***************************************************************************************************************************!*\
  !*** ./src/app/modules/account/pages/details/components/mutual-aid-community-info/mutual-aid-community-info.component.ts ***!
  \***************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MutualAidCommunityInfoComponent: () => (/* binding */ MutualAidCommunityInfoComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _MutualAidCommunityInfoComponent;



function MutualAidCommunityInfoComponent_ion_card_0_div_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 3)(1, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Services Needed");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.mutualAidCommunityEngagement.servicesNeeded.join(", "));
  }
}
function MutualAidCommunityInfoComponent_ion_card_0_div_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 3)(1, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Groups or Forums Participation");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r0.mutualAidCommunityEngagement.groupsOrForumsParticipation.join(", "), " ");
  }
}
function MutualAidCommunityInfoComponent_ion_card_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-card", 1)(1, "ion-card-header")(2, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Mutual Aid Community Engagement");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "ion-card-content")(5, "ion-grid")(6, "ion-row")(7, "ion-col", 2)(8, "div", 3)(9, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "Services Offered");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](13, MutualAidCommunityInfoComponent_ion_card_0_div_13_Template, 5, 1, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 3)(15, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "Community Affiliations");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "ion-col", 2)(20, "div", 3)(21, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Willingness to Provide Mentorship");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 3)(26, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Interest in Receiving Mentorship");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](30, MutualAidCommunityInfoComponent_ion_card_0_div_30_Template, 5, 1, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r0.mutualAidCommunityEngagement.servicesOffered.join(", ") || "None", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.mutualAidCommunityEngagement.servicesNeeded && ctx_r0.mutualAidCommunityEngagement.servicesNeeded.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r0.mutualAidCommunityEngagement.communityAffiliations.join(", ") || "None", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r0.mutualAidCommunityEngagement.willingnessToProvideMentorship ? "Yes" : "No", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r0.mutualAidCommunityEngagement.interestInReceivingMentorship ? "Yes" : "No", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.mutualAidCommunityEngagement.groupsOrForumsParticipation && ctx_r0.mutualAidCommunityEngagement.groupsOrForumsParticipation.length);
  }
}
class MutualAidCommunityInfoComponent {
  constructor() {}
}
_MutualAidCommunityInfoComponent = MutualAidCommunityInfoComponent;
_MutualAidCommunityInfoComponent.ɵfac = function MutualAidCommunityInfoComponent_Factory(t) {
  return new (t || _MutualAidCommunityInfoComponent)();
};
_MutualAidCommunityInfoComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: _MutualAidCommunityInfoComponent,
  selectors: [["app-mutual-aid-community-info"]],
  inputs: {
    mutualAidCommunityEngagement: "mutualAidCommunityEngagement"
  },
  decls: 1,
  vars: 1,
  consts: [["class", "mutual-aid-info-card", 4, "ngIf"], [1, "mutual-aid-info-card"], ["size", "6"], [1, "info-block"], ["class", "info-block", 4, "ngIf"]],
  template: function MutualAidCommunityInfoComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, MutualAidCommunityInfoComponent_ion_card_0_Template, 31, 6, "ion-card", 0);
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.mutualAidCommunityEngagement);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonCard, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonCardContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonCardHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonCardTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonRow],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.mutual-aid-info-card[_ngcontent-%COMP%] {\n  border: 1px solid var(--ion-color-primary);\n}\n\n.mutual-aid-info-card[_ngcontent-%COMP%]   ion-card-title[_ngcontent-%COMP%] {\n  font-size: 1.5em;\n  margin-bottom: 16px;\n}\n\n.mutual-aid-info-card[_ngcontent-%COMP%]   .info-block[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n\n.mutual-aid-info-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.2em;\n  font-weight: bold;\n  color: #000;\n  margin: 0;\n}\n\n.mutual-aid-info-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1em;\n  margin: 4px 0 0 0;\n}\n\n@media (prefers-color-scheme: dark) {\n  .mutual-aid-info-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    color: #fff;\n  }\n  .mutual-aid-info-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    color: #aaa;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2RldGFpbHMvY29tcG9uZW50cy9tdXR1YWwtYWlkLWNvbW11bml0eS1pbmZvL211dHVhbC1haWQtY29tbXVuaXR5LWluZm8uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQTtBQW1CQTtFQUNFLDBDQUFBO0FBQ0Y7O0FBRUE7RUFDRSxnQkFBQTtFQUNBLG1CQUFBO0FBQ0Y7O0FBRUE7RUFDRSxtQkFBQTtBQUNGOztBQUVBO0VBQ0UsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLFdBQUE7RUFDQSxTQUFBO0FBQ0Y7O0FBRUE7RUFDRSxjQUFBO0VBQ0EsaUJBQUE7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsV0FBQTtFQUNGO0VBRUE7SUFDRSxXQUFBO0VBQUY7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLm11dHVhbC1haWQtaW5mby1jYXJkIHtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0taW9uLWNvbG9yLXByaW1hcnkpO1xufVxuXG4ubXV0dWFsLWFpZC1pbmZvLWNhcmQgaW9uLWNhcmQtdGl0bGUge1xuICBmb250LXNpemU6IDEuNWVtO1xuICBtYXJnaW4tYm90dG9tOiAxNnB4O1xufVxuXG4ubXV0dWFsLWFpZC1pbmZvLWNhcmQgLmluZm8tYmxvY2sge1xuICBtYXJnaW4tYm90dG9tOiAxNnB4O1xufVxuXG4ubXV0dWFsLWFpZC1pbmZvLWNhcmQgaDIge1xuICBmb250LXNpemU6IDEuMmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY29sb3I6ICMwMDA7XG4gIG1hcmdpbjogMDtcbn1cblxuLm11dHVhbC1haWQtaW5mby1jYXJkIHAge1xuICBmb250LXNpemU6IDFlbTtcbiAgbWFyZ2luOiA0cHggMCAwIDA7XG59XG5cbkBtZWRpYSAocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspIHtcbiAgLm11dHVhbC1haWQtaW5mby1jYXJkIGgyIHtcbiAgICBjb2xvcjogI2ZmZjtcbiAgfVxuXG4gIC5tdXR1YWwtYWlkLWluZm8tY2FyZCBwIHtcbiAgICBjb2xvcjogI2FhYTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 5933:
/*!***********************************************************************************************************!*\
  !*** ./src/app/modules/account/pages/details/components/professional-info/professional-info.component.ts ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProfessionalInfoComponent: () => (/* binding */ ProfessionalInfoComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _ProfessionalInfoComponent;


class ProfessionalInfoComponent {
  constructor() {}
}
_ProfessionalInfoComponent = ProfessionalInfoComponent;
_ProfessionalInfoComponent.ɵfac = function ProfessionalInfoComponent_Factory(t) {
  return new (t || _ProfessionalInfoComponent)();
};
_ProfessionalInfoComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: _ProfessionalInfoComponent,
  selectors: [["app-professional-info"]],
  inputs: {
    professionalInfo: "professionalInfo"
  },
  decls: 44,
  vars: 8,
  consts: [[1, "professional-info-card"], ["size", "6"], [1, "info-block"], ["target", "_blank", 3, "href"]],
  template: function ProfessionalInfoComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-card", 0)(1, "ion-card-header")(2, "ion-card-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Professional Information");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "ion-card-content")(5, "ion-grid")(6, "ion-row")(7, "ion-col", 1)(8, "div", 2)(9, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "Employer Name");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 2)(14, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Current Title");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 2)(19, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Occupation");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 2)(24, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "Work Experience");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "ion-col", 1)(29, "div", 2)(30, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "Skills and Expertise");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "div", 2)(35, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, "Educational Background");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "div", 2)(40, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](41, "LinkedIn Profile");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "a", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()()();
    }
    if (rf & 2) {
      let tmp_0_0;
      let tmp_1_0;
      let tmp_2_0;
      let tmp_3_0;
      let tmp_4_0;
      let tmp_5_0;
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](12);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"]((tmp_0_0 = ctx.professionalInfo == null ? null : ctx.professionalInfo.employerName) !== null && tmp_0_0 !== undefined ? tmp_0_0 : "-");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"]((tmp_1_0 = ctx.professionalInfo == null ? null : ctx.professionalInfo.currentJobTitle) !== null && tmp_1_0 !== undefined ? tmp_1_0 : "-");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"]((tmp_2_0 = ctx.professionalInfo == null ? null : ctx.professionalInfo.occupation) !== null && tmp_2_0 !== undefined ? tmp_2_0 : "-");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"]((tmp_3_0 = ctx.professionalInfo == null ? null : ctx.professionalInfo.workExperience) !== null && tmp_3_0 !== undefined ? tmp_3_0 : "-");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"]((tmp_4_0 = ctx.professionalInfo == null ? null : ctx.professionalInfo.skillsAndExpertise == null ? null : ctx.professionalInfo.skillsAndExpertise.join(", ")) !== null && tmp_4_0 !== undefined ? tmp_4_0 : "-");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"]((tmp_5_0 = ctx.professionalInfo == null ? null : ctx.professionalInfo.educationalBackground) !== null && tmp_5_0 !== undefined ? tmp_5_0 : "-");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("href", ctx.professionalInfo == null ? null : ctx.professionalInfo.linkedInProfile, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.professionalInfo == null ? null : ctx.professionalInfo.linkedInProfile);
    }
  },
  dependencies: [_ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonCard, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonCardContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonCardHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonCardTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonRow],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.professional-info-card[_ngcontent-%COMP%] {\n  border: 1px solid var(--ion-color-primary);\n}\n\n.professional-info-card[_ngcontent-%COMP%]   ion-card-title[_ngcontent-%COMP%] {\n  font-size: 1.5em;\n  margin-bottom: 16px;\n}\n\n.professional-info-card[_ngcontent-%COMP%]   .info-block[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n\n.professional-info-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.2em;\n  font-weight: bold;\n  color: #000;\n  margin: 0;\n}\n\n.professional-info-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1em;\n  margin: 4px 0 0 0;\n}\n\n@media (prefers-color-scheme: dark) {\n  .professional-info-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    color: #fff;\n  }\n  .professional-info-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    color: #aaa;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2RldGFpbHMvY29tcG9uZW50cy9wcm9mZXNzaW9uYWwtaW5mby9wcm9mZXNzaW9uYWwtaW5mby5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OytGQUFBO0FBbUJBO0VBQ0UsMENBQUE7QUFDRjs7QUFFQTtFQUNFLGdCQUFBO0VBQ0EsbUJBQUE7QUFDRjs7QUFFQTtFQUNFLG1CQUFBO0FBQ0Y7O0FBRUE7RUFDRSxnQkFBQTtFQUNBLGlCQUFBO0VBQ0EsV0FBQTtFQUNBLFNBQUE7QUFDRjs7QUFFQTtFQUNFLGNBQUE7RUFDQSxpQkFBQTtBQUNGOztBQUVBO0VBQ0U7SUFDRSxXQUFBO0VBQ0Y7RUFFQTtJQUNFLFdBQUE7RUFBRjtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4ucHJvZmVzc2lvbmFsLWluZm8tY2FyZCB7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWlvbi1jb2xvci1wcmltYXJ5KTtcbn1cblxuLnByb2Zlc3Npb25hbC1pbmZvLWNhcmQgaW9uLWNhcmQtdGl0bGUge1xuICBmb250LXNpemU6IDEuNWVtO1xuICBtYXJnaW4tYm90dG9tOiAxNnB4O1xufVxuXG4ucHJvZmVzc2lvbmFsLWluZm8tY2FyZCAuaW5mby1ibG9jayB7XG4gIG1hcmdpbi1ib3R0b206IDE2cHg7XG59XG5cbi5wcm9mZXNzaW9uYWwtaW5mby1jYXJkIGgyIHtcbiAgZm9udC1zaXplOiAxLjJlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGNvbG9yOiAjMDAwO1xuICBtYXJnaW46IDA7XG59XG5cbi5wcm9mZXNzaW9uYWwtaW5mby1jYXJkIHAge1xuICBmb250LXNpemU6IDFlbTtcbiAgbWFyZ2luOiA0cHggMCAwIDA7XG59XG5cbkBtZWRpYSAocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspIHtcbiAgLnByb2Zlc3Npb25hbC1pbmZvLWNhcmQgaDIge1xuICAgIGNvbG9yOiAjZmZmO1xuICB9XG5cbiAgLnByb2Zlc3Npb25hbC1pbmZvLWNhcmQgcCB7XG4gICAgY29sb3I6ICNhYWE7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ }),

/***/ 5521:
/*!***************************************************************************************!*\
  !*** ./src/app/modules/account/pages/details/components/profile/profile.component.ts ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProfileComponent: () => (/* binding */ ProfileComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _ProfileComponent;



function ProfileComponent_p_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p")(1, "a", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const link_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("href", link_r1.url, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](link_r1.name || link_r1.url);
  }
}
function ProfileComponent_p_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p")(1, "a", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const link_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("href", link_r2.url, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](link_r2.name || link_r2.url);
  }
}
function ProfileComponent_p_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p")(1, "a", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const link_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("href", link_r3.url, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](link_r3.name || link_r3.url);
  }
}
class ProfileComponent {
  constructor() {
    this.account = {
      type: "user",
      description: "",
      webLinks: []
    };
  }
  get getSectionTitle() {
    var _this$account$groupDe;
    if (this.account.type === "user") {
      return "Profile";
    }
    return "Organization (" + ((_this$account$groupDe = this.account.groupDetails) === null || _this$account$groupDe === void 0 ? void 0 : _this$account$groupDe.groupType) + ")";
  }
  getWebLinks(category) {
    if (!this.account || !this.account.webLinks) {
      return [];
    }
    return this.account.webLinks.filter(link => link.category === category);
  }
  getOtherWebLinks() {
    if (!this.account || !this.account.webLinks) {
      return [];
    }
    return this.account.webLinks.filter(link => !["Donation", "Social Media", "Personal Website"].includes(link.category));
  }
}
_ProfileComponent = ProfileComponent;
_ProfileComponent.ɵfac = function ProfileComponent_Factory(t) {
  return new (t || _ProfileComponent)();
};
_ProfileComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: _ProfileComponent,
  selectors: [["app-profile"]],
  inputs: {
    account: "account"
  },
  decls: 26,
  vars: 5,
  consts: [[1, "profile-info-card"], ["size", "8"], [1, "info-block"], ["size", "4"], [4, "ngFor", "ngForOf"], ["target", "_blank", 3, "href"]],
  template: function ProfileComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-card", 0)(1, "ion-card-header")(2, "ion-card-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "ion-card-content")(5, "ion-grid")(6, "ion-row")(7, "ion-col", 1)(8, "div", 2)(9, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "Description");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "ion-col", 3)(14, "div", 2)(15, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "Website");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](17, ProfileComponent_p_17_Template, 3, 2, "p", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 2)(19, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Social Media");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](21, ProfileComponent_p_21_Template, 3, 2, "p", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 2)(23, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Other");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](25, ProfileComponent_p_25_Template, 3, 2, "p", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.getSectionTitle);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.account.description);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.getWebLinks("Personal Website"));
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.getWebLinks("Social Media"));
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.getOtherWebLinks());
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonCard, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonCardContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonCardHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonCardTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonRow],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.profile-info-card[_ngcontent-%COMP%] {\n  border: 1px solid var(--ion-color-primary);\n}\n\n.profile-info-card[_ngcontent-%COMP%]   ion-card-title[_ngcontent-%COMP%] {\n  font-size: 1.5em;\n  margin-bottom: 16px;\n}\n\n.profile-info-card[_ngcontent-%COMP%]   .info-block[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n\n.profile-info-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.2em;\n  font-weight: bold;\n  color: #000;\n  margin: 0;\n}\n\n.profile-info-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1em;\n  margin: 4px 0 0 0;\n}\n\n@media (prefers-color-scheme: dark) {\n  .profile-info-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    color: #fff;\n  }\n  .profile-info-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    color: #aaa;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2RldGFpbHMvY29tcG9uZW50cy9wcm9maWxlL3Byb2ZpbGUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQTtBQW1CQTtFQUNFLDBDQUFBO0FBQ0Y7O0FBRUE7RUFDRSxnQkFBQTtFQUNBLG1CQUFBO0FBQ0Y7O0FBRUE7RUFDRSxtQkFBQTtBQUNGOztBQUVBO0VBQ0UsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLFdBQUE7RUFDQSxTQUFBO0FBQ0Y7O0FBRUE7RUFDRSxjQUFBO0VBQ0EsaUJBQUE7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsV0FBQTtFQUNGO0VBRUE7SUFDRSxXQUFBO0VBQUY7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLnByb2ZpbGUtaW5mby1jYXJkIHtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0taW9uLWNvbG9yLXByaW1hcnkpO1xufVxuXG4ucHJvZmlsZS1pbmZvLWNhcmQgaW9uLWNhcmQtdGl0bGUge1xuICBmb250LXNpemU6IDEuNWVtO1xuICBtYXJnaW4tYm90dG9tOiAxNnB4O1xufVxuXG4ucHJvZmlsZS1pbmZvLWNhcmQgLmluZm8tYmxvY2sge1xuICBtYXJnaW4tYm90dG9tOiAxNnB4O1xufVxuXG4ucHJvZmlsZS1pbmZvLWNhcmQgaDIge1xuICBmb250LXNpemU6IDEuMmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY29sb3I6ICMwMDA7XG4gIG1hcmdpbjogMDtcbn1cblxuLnByb2ZpbGUtaW5mby1jYXJkIHAge1xuICBmb250LXNpemU6IDFlbTtcbiAgbWFyZ2luOiA0cHggMCAwIDA7XG59XG5cbkBtZWRpYSAocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspIHtcbiAgLnByb2ZpbGUtaW5mby1jYXJkIGgyIHtcbiAgICBjb2xvcjogI2ZmZjtcbiAgfVxuXG4gIC5wcm9maWxlLWluZm8tY2FyZCBwIHtcbiAgICBjb2xvcjogI2FhYTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 9803:
/*!*********************************************************************************************************!*\
  !*** ./src/app/modules/account/pages/details/components/related-accounts/related-accounts.component.ts ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RelatedAccountsComponent: () => (/* binding */ RelatedAccountsComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _RelatedAccountsComponent;




function RelatedAccountsComponent_ion_item_8_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 5);
  }
  if (rf & 2) {
    const account_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("alt", account_r2.name)("src", account_r2.iconImage, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
  }
}
function RelatedAccountsComponent_ion_item_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-item", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function RelatedAccountsComponent_ion_item_8_Template_ion_item_click_0_listener() {
      const account_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1).$implicit;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r2.goToRelatedAccount(account_r2.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "ion-thumbnail", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, RelatedAccountsComponent_ion_item_8_img_2_Template, 1, 2, "img", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "ion-label")(4, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const account_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", account_r2.iconImage);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](account_r2.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](account_r2.tagline);
  }
}
class RelatedAccountsComponent {
  constructor(router) {
    this.router = router;
    this.account = {};
    this.relatedAccounts = [];
    this.type = "user";
  }
  get title() {
    if (this.type === "user") {
      var _this$account;
      return ((_this$account = this.account) === null || _this$account === void 0 ? void 0 : _this$account.type) === "user" ? "Friends" : "Members";
    }
    return "Organizations";
  }
  get filteredRelatedAccounts() {
    return this.relatedAccounts.filter(ra => ra.type === this.type && ra.status === "accepted");
  }
  goToRelatedAccount(id) {
    if (id) {
      this.router.navigate([`/account/${id}`]);
    } else {
      console.error("Invalid ID provided for navigation.");
    }
  }
  viewAll() {
    var _this$account2;
    if ((_this$account2 = this.account) !== null && _this$account2 !== void 0 && _this$account2.id) {
      this.router.navigate([`/account/${this.account.id}/related/${this.type}`]);
    }
  }
}
_RelatedAccountsComponent = RelatedAccountsComponent;
_RelatedAccountsComponent.ɵfac = function RelatedAccountsComponent_Factory(t) {
  return new (t || _RelatedAccountsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__.Router));
};
_RelatedAccountsComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: _RelatedAccountsComponent,
  selectors: [["app-related-accounts"]],
  inputs: {
    account: "account",
    relatedAccounts: "relatedAccounts",
    type: "type"
  },
  decls: 12,
  vars: 8,
  consts: [["button", "", 3, "click", 4, "ngFor", "ngForOf"], ["fill", "clear", 3, "click"], ["button", "", 3, "click"], ["slot", "start"], [3, "alt", "src", 4, "ngIf"], [3, "alt", "src"]],
  template: function RelatedAccountsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-card")(1, "ion-card-header")(2, "ion-card-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "ion-card-subtitle");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "ion-card-content")(7, "ion-list");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, RelatedAccountsComponent_ion_item_8_Template, 8, 3, "ion-item", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](9, "slice");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "ion-button", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function RelatedAccountsComponent_Template_ion_button_click_10_listener() {
        return ctx.viewAll();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "View All");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.title);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("", ctx.filteredRelatedAccounts.length, " ", ctx.title.toLowerCase(), "");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind3"](9, 4, ctx.filteredRelatedAccounts, 0, 4));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonCard, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonCardContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonCardHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonCardSubtitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonCardTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonList, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonThumbnail, _angular_common__WEBPACK_IMPORTED_MODULE_2__.SlicePipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nion-card[_ngcontent-%COMP%] {\n  border: 1px solid var(--ion-color-primary); \n\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2RldGFpbHMvY29tcG9uZW50cy9yZWxhdGVkLWFjY291bnRzL3JlbGF0ZWQtYWNjb3VudHMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQTtBQW1CQTtFQUNFLDBDQUFBLEVBQUEsa0NBQUE7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuaW9uLWNhcmQge1xuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1pb24tY29sb3ItcHJpbWFyeSk7IC8qIEFkZCB5b3VyIGRlc2lyZWQgYm9yZGVyIGNvbG9yICovXG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 5445:
/*!*********************************************************************************************************!*\
  !*** ./src/app/modules/account/pages/details/components/related-listings/related-listings.component.ts ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RelatedListingsComponent: () => (/* binding */ RelatedListingsComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _RelatedListingsComponent;




function RelatedListingsComponent_ion_item_8_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 5);
  }
  if (rf & 2) {
    const listing_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("alt", listing_r2.title)("src", listing_r2.iconImage, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
  }
}
function RelatedListingsComponent_ion_item_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-item", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function RelatedListingsComponent_ion_item_8_Template_ion_item_click_0_listener() {
      const listing_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1).$implicit;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r2.goToRelatedListing(listing_r2.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "ion-thumbnail", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, RelatedListingsComponent_ion_item_8_img_2_Template, 1, 2, "img", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "ion-label")(4, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const listing_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", listing_r2.iconImage);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](listing_r2.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](listing_r2.type);
  }
}
class RelatedListingsComponent {
  constructor(router) {
    this.router = router;
    this.account = {};
    this.relatedListings = [];
    this.relationship = "owner";
  }
  get title() {
    switch (this.relationship) {
      case "owner":
        return "My Listings";
      case "applicant":
        return "Applications";
      case "participant":
        return "Participating Listings";
      case "saved":
        return "Saved Listings";
      default:
        return "Listings";
    }
  }
  get filteredRelatedListings() {
    return this.relatedListings.filter(rl => rl.relationship === this.relationship);
  }
  goToRelatedListing(id) {
    if (id) {
      this.router.navigate([`/listings/${id}`]);
    } else {
      console.error("Invalid ID provided for navigation.");
    }
  }
  viewAll() {
    var _this$account;
    if ((_this$account = this.account) !== null && _this$account !== void 0 && _this$account.id) {
      this.router.navigate([`/account/${this.account.id}/listings`]);
    }
  }
}
_RelatedListingsComponent = RelatedListingsComponent;
_RelatedListingsComponent.ɵfac = function RelatedListingsComponent_Factory(t) {
  return new (t || _RelatedListingsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__.Router));
};
_RelatedListingsComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: _RelatedListingsComponent,
  selectors: [["app-related-listings"]],
  inputs: {
    account: "account",
    relatedListings: "relatedListings",
    relationship: "relationship"
  },
  decls: 12,
  vars: 8,
  consts: [["button", "", 3, "click", 4, "ngFor", "ngForOf"], ["fill", "clear", 3, "click"], ["button", "", 3, "click"], ["slot", "start"], [3, "alt", "src", 4, "ngIf"], [3, "alt", "src"]],
  template: function RelatedListingsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-card")(1, "ion-card-header")(2, "ion-card-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "ion-card-subtitle");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "ion-card-content")(7, "ion-list");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, RelatedListingsComponent_ion_item_8_Template, 8, 3, "ion-item", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](9, "slice");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "ion-button", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function RelatedListingsComponent_Template_ion_button_click_10_listener() {
        return ctx.viewAll();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "View All");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.title);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"](" ", ctx.filteredRelatedListings.length, " ", ctx.title.toLowerCase(), " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind3"](9, 4, ctx.filteredRelatedListings, 0, 4));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonCard, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonCardContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonCardHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonCardSubtitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonCardTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonList, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonThumbnail, _angular_common__WEBPACK_IMPORTED_MODULE_2__.SlicePipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nion-card[_ngcontent-%COMP%] {\n  border: 1px solid var(--ion-color-primary);\n}\n\nion-thumbnail[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  object-fit: cover;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2RldGFpbHMvY29tcG9uZW50cy9yZWxhdGVkLWxpc3RpbmdzL3JlbGF0ZWQtbGlzdGluZ3MuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQTtBQW1CQTtFQUNFLDBDQUFBO0FBQ0Y7O0FBRUE7RUFDRSxpQkFBQTtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5pb24tY2FyZCB7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWlvbi1jb2xvci1wcmltYXJ5KTtcbn1cblxuaW9uLXRodW1ibmFpbCBpbWcge1xuICBvYmplY3QtZml0OiBjb3Zlcjtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ }),

/***/ 9949:
/*!***************************************************************************************************************************!*\
  !*** ./src/app/modules/account/pages/details/components/volunteer-preference-info/volunteer-preference-info.component.ts ***!
  \***************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VolunteerPreferenceInfoComponent: () => (/* binding */ VolunteerPreferenceInfoComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _VolunteerPreferenceInfoComponent;


class VolunteerPreferenceInfoComponent {
  constructor() {}
  ngOnChanges(changes) {
    if (changes["volunteerPreferences"] && this.volunteerPreferences) {
      this.preferredVolunteerRolesString = Array.isArray(this.volunteerPreferences.preferredVolunteerRoles) ? this.volunteerPreferences.preferredVolunteerRoles.join(", ") : undefined;
    }
  }
}
_VolunteerPreferenceInfoComponent = VolunteerPreferenceInfoComponent;
_VolunteerPreferenceInfoComponent.ɵfac = function VolunteerPreferenceInfoComponent_Factory(t) {
  return new (t || _VolunteerPreferenceInfoComponent)();
};
_VolunteerPreferenceInfoComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: _VolunteerPreferenceInfoComponent,
  selectors: [["app-volunteer-preference-info"]],
  inputs: {
    volunteerPreferences: "volunteerPreferences"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"]],
  decls: 39,
  vars: 6,
  consts: [[1, "volunteer-info-card"], [1, "info-block"]],
  template: function VolunteerPreferenceInfoComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-card", 0)(1, "ion-card-header")(2, "ion-card-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Volunteer Preferences");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "ion-card-content")(5, "ion-grid")(6, "ion-row")(7, "ion-col")(8, "div", 1)(9, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "Areas of Interest");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 1)(14, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Availability");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 1)(19, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Willingness to Travel");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "ion-col")(24, "div", 1)(25, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "Preferred Volunteer Roles");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div", 1)(30, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "Desired Level of Commitment");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "div", 1)(35, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, "Previous Volunteer Experience");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](12);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", (ctx.volunteerPreferences == null ? null : ctx.volunteerPreferences.areasOfInterest == null ? null : ctx.volunteerPreferences.areasOfInterest.join(", ")) || "-", " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"]((ctx.volunteerPreferences == null ? null : ctx.volunteerPreferences.availability) || "-");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", (ctx.volunteerPreferences == null ? null : ctx.volunteerPreferences.willingnessToTravel) ? "Yes" : "No", " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.preferredVolunteerRolesString || "-");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"]((ctx.volunteerPreferences == null ? null : ctx.volunteerPreferences.desiredLevelOfCommitment) || "-");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", (ctx.volunteerPreferences == null ? null : ctx.volunteerPreferences.previousVolunteerExperience) || "-", " ");
    }
  },
  dependencies: [_ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonCard, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonCardContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonCardHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonCardTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonRow],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.volunteer-info-card[_ngcontent-%COMP%] {\n  border: 1px solid var(--ion-color-primary);\n}\n\n.volunteer-info-card[_ngcontent-%COMP%]   ion-card-title[_ngcontent-%COMP%] {\n  font-size: 1.5em;\n  margin-bottom: 16px;\n}\n\n.volunteer-info-card[_ngcontent-%COMP%]   .info-block[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n\n.volunteer-info-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.2em;\n  font-weight: bold;\n  color: #000;\n  margin: 0;\n}\n\n.volunteer-info-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1em;\n  margin: 4px 0 0 0;\n}\n\n@media (prefers-color-scheme: dark) {\n  .volunteer-info-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    color: #fff;\n  }\n  .volunteer-info-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    color: #aaa;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2RldGFpbHMvY29tcG9uZW50cy92b2x1bnRlZXItcHJlZmVyZW5jZS1pbmZvL3ZvbHVudGVlci1wcmVmZXJlbmNlLWluZm8uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQTtBQW1CQTtFQUNFLDBDQUFBO0FBQ0Y7O0FBRUE7RUFDRSxnQkFBQTtFQUNBLG1CQUFBO0FBQ0Y7O0FBRUE7RUFDRSxtQkFBQTtBQUNGOztBQUVBO0VBQ0UsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLFdBQUE7RUFDQSxTQUFBO0FBQ0Y7O0FBRUE7RUFDRSxjQUFBO0VBQ0EsaUJBQUE7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsV0FBQTtFQUNGO0VBRUE7SUFDRSxXQUFBO0VBQUY7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLnZvbHVudGVlci1pbmZvLWNhcmQge1xuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1pb24tY29sb3ItcHJpbWFyeSk7XG59XG5cbi52b2x1bnRlZXItaW5mby1jYXJkIGlvbi1jYXJkLXRpdGxlIHtcbiAgZm9udC1zaXplOiAxLjVlbTtcbiAgbWFyZ2luLWJvdHRvbTogMTZweDtcbn1cblxuLnZvbHVudGVlci1pbmZvLWNhcmQgLmluZm8tYmxvY2sge1xuICBtYXJnaW4tYm90dG9tOiAxNnB4O1xufVxuXG4udm9sdW50ZWVyLWluZm8tY2FyZCBoMiB7XG4gIGZvbnQtc2l6ZTogMS4yZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBjb2xvcjogIzAwMDtcbiAgbWFyZ2luOiAwO1xufVxuXG4udm9sdW50ZWVyLWluZm8tY2FyZCBwIHtcbiAgZm9udC1zaXplOiAxZW07XG4gIG1hcmdpbjogNHB4IDAgMCAwO1xufVxuXG5AbWVkaWEgKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKSB7XG4gIC52b2x1bnRlZXItaW5mby1jYXJkIGgyIHtcbiAgICBjb2xvcjogI2ZmZjtcbiAgfVxuXG4gIC52b2x1bnRlZXItaW5mby1jYXJkIHAge1xuICAgIGNvbG9yOiAjYWFhO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 9263:
/*!***************************************************************!*\
  !*** ./src/app/modules/account/pages/details/details.page.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DetailsPage: () => (/* binding */ DetailsPage)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! rxjs */ 1640);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! rxjs/operators */ 1856);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs/operators */ 5117);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs/operators */ 1969);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! rxjs/operators */ 4406);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../state/selectors/account.selectors */ 8686);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../state/actions/account.actions */ 8314);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _core_services_meta_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../core/services/meta.service */ 6369);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/components/app-header/app-header.component */ 8245);
/* harmony import */ var _components_contact_information_contact_information_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/contact-information/contact-information.component */ 2293);
/* harmony import */ var _components_hero_hero_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/hero/hero.component */ 5295);
/* harmony import */ var _components_professional_info_professional_info_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/professional-info/professional-info.component */ 5933);
/* harmony import */ var _components_related_accounts_related_accounts_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/related-accounts/related-accounts.component */ 9803);
/* harmony import */ var _components_volunteer_preference_info_volunteer_preference_info_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/volunteer-preference-info/volunteer-preference-info.component */ 9949);
/* harmony import */ var _components_profile_profile_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/profile/profile.component */ 5521);
/* harmony import */ var _components_mutual_aid_community_info_mutual_aid_community_info_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/mutual-aid-community-info/mutual-aid-community-info.component */ 9417);
/* harmony import */ var _components_related_listings_related_listings_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/related-listings/related-listings.component */ 5445);
var _DetailsPage;





















const _c0 = () => [];
function DetailsPage_ng_container_0_a_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "a", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function DetailsPage_ng_container_0_a_9_Template_a_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵresetView"](ctx_r1.scrollToSection("professional"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Professional Contact");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
function DetailsPage_ng_container_0_a_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "a", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function DetailsPage_ng_container_0_a_14_Template_a_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵresetView"](ctx_r1.scrollToSection("volunteer"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Volunteer Preferences");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
function DetailsPage_ng_container_0_a_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "a", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function DetailsPage_ng_container_0_a_15_Template_a_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵresetView"](ctx_r1.scrollToSection("mutual-aid"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Mutual Aid");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
function DetailsPage_ng_container_0_app_professional_info_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](0, "app-professional-info", 16);
  }
  if (rf & 2) {
    const account_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("professionalInfo", account_r6.professionalInformation);
  }
}
function DetailsPage_ng_container_0_app_volunteer_preference_info_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](0, "app-volunteer-preference-info", 17);
  }
  if (rf & 2) {
    const account_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("volunteerPreferences", account_r6.volunteerPreferences);
  }
}
function DetailsPage_ng_container_0_app_mutual_aid_community_info_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](0, "app-mutual-aid-community-info", 18);
  }
  if (rf & 2) {
    const account_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("mutualAidCommunityEngagement", account_r6.mutualAidCommunityEngagement);
  }
}
function DetailsPage_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](1, "ion-header");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](2, "app-header", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](3, "ion-content", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](4, "app-hero", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](5, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](6, "div", 5)(7, "a", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function DetailsPage_ng_container_0_Template_a_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵresetView"](ctx_r1.scrollToSection("contact"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](8, "Contact Information");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtemplate"](9, DetailsPage_ng_container_0_a_9_Template, 2, 0, "a", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](10, "a", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function DetailsPage_ng_container_0_Template_a_click_10_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵresetView"](ctx_r1.scrollToSection("users"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](12, "a", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function DetailsPage_ng_container_0_Template_a_click_12_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵresetView"](ctx_r1.scrollToSection("groups"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](13, "Organizations");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtemplate"](14, DetailsPage_ng_container_0_a_14_Template, 2, 0, "a", 7)(15, DetailsPage_ng_container_0_a_15_Template, 2, 0, "a", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](16, "a", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function DetailsPage_ng_container_0_Template_a_click_16_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵresetView"](ctx_r1.scrollToSection("listings"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](17, "Listings");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](18, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](19, "app-profile", 8)(20, "app-contact-information", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtemplate"](21, DetailsPage_ng_container_0_app_professional_info_21_Template, 1, 1, "app-professional-info", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](22, "app-related-accounts", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](23, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](24, "app-related-accounts", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](25, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](26, "app-related-listings", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](27, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtemplate"](28, DetailsPage_ng_container_0_app_volunteer_preference_info_28_Template, 1, 1, "app-volunteer-preference-info", 14)(29, DetailsPage_ng_container_0_app_mutual_aid_community_info_29_Template, 1, 1, "app-mutual-aid-community-info", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    let tmp_6_0;
    let tmp_15_0;
    let tmp_17_0;
    let tmp_19_0;
    const account_r6 = ctx.ngIf;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("title", account_r6.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("fullscreen", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("account", account_r6)("isProfileOwner", (tmp_6_0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind1"](5, 19, ctx_r1.isProfileOwner$)) !== null && tmp_6_0 !== undefined ? tmp_6_0 : false);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngIf", account_r6.type === "user");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", account_r6.type === "user" ? "Friends" : "Members", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngIf", account_r6.type === "user");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngIf", account_r6.type === "user" && account_r6.mutualAidCommunityEngagement);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("account", account_r6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("account", account_r6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngIf", account_r6.type === "user");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("account", account_r6)("relatedAccounts", (tmp_15_0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind1"](23, 21, ctx_r1.relatedAccounts$)) !== null && tmp_15_0 !== undefined ? tmp_15_0 : _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpureFunction0"](27, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("account", account_r6)("relatedAccounts", (tmp_17_0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind1"](25, 23, ctx_r1.relatedAccounts$)) !== null && tmp_17_0 !== undefined ? tmp_17_0 : _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpureFunction0"](28, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("account", account_r6)("relatedListings", (tmp_19_0 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind1"](27, 25, ctx_r1.relatedListings$)) !== null && tmp_19_0 !== undefined ? tmp_19_0 : _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpureFunction0"](29, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngIf", account_r6.type === "user");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngIf", account_r6.type === "user" && account_r6.mutualAidCommunityEngagement);
  }
}
function DetailsPage_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1, "Loading account details...");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
class DetailsPage {
  constructor(metaService, route, router, store) {
    this.metaService = metaService;
    this.route = route;
    this.router = router;
    this.store = store;
    this.accountId = null;
    this.subscription = null;
  }
  ngOnInit() {
    this.authUser$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_0__.selectAuthUser);
    this.authUser$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_14__.filter)(user => user !== null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_16__.tap)(user => {
      if (!user.type) {
        this.router.navigate([`/account/registration/${user.uid}`]);
      }
    })).subscribe();
  }
  ionViewWillEnter() {
    // Initialize authUser$ observable
    this.authUser$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_0__.selectAuthUser);
    // Subscribe to route paramMap to detect changes in accountId
    this.route.paramMap.subscribe(params => {
      this.accountId = params.get("accountId");
      if (this.accountId) {
        // Dispatch loadAccount action to fetch account data
        this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.loadAccount({
          accountId: this.accountId
        }));
        this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.loadRelatedAccounts({
          accountId: this.accountId
        }));
        this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.loadRelatedListings({
          accountId: this.accountId
        }));
        // Select account and related accounts from the store
        this.account$ = this.store.select((0,_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAccountById)(this.accountId));
        this.relatedAccounts$ = this.store.select((0,_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__.selectRelatedAccountsByAccountId)(this.accountId));
        this.relatedListings$ = this.store.select((0,_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__.selectRelatedListingsByAccountId)(this.accountId)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_17__.map)(listings => listings.filter(listing => listing.status === "active")));
        // Determine if the current user is the profile owner
        this.isProfileOwner$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_18__.combineLatest)([this.authUser$, this.account$]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_17__.map)(([authUser, account]) => {
          if (account && authUser) {
            return account.id === authUser.uid;
          }
          return false;
        }));
      }
    });
    this.subscription = this.account$.subscribe({
      next: account => {
        if (account) {
          this.updateAccountMeta(account);
        }
      },
      error: () => {
        this.setDefaultMeta();
      }
    });
  }
  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Unsubscribe to prevent memory leaks
      this.subscription = null;
    }
  }
  scrollToSection(sectionId) {
    var _document$getElementB;
    const yOffset = (_document$getElementB = document.getElementById(sectionId)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.offsetTop;
    if (yOffset !== undefined) {
      this.content.scrollToPoint(0, yOffset, 500);
    }
  }
  updateAccountMeta(account) {
    const accountType = account.type === "user" ? "Profile" : account.type.charAt(0).toUpperCase() + account.type.slice(1);
    const descriptionPrefix = account.type === "user" ? `Explore ${account.name}'s profile. Learn about their volunteering efforts and achievements on ASCENDynamics NFP.` : `Discover ${account.name}. Join their efforts to make a difference through volunteering.`;
    const tags = account.type === "user" ? "profile, user, volunteer" : "group, volunteer, community";
    this.metaService.updateMetaTags(`${account.name} | ASCENDynamics NFP`, descriptionPrefix, tags, {
      title: `${account.name} | ASCENDynamics NFP`,
      description: descriptionPrefix,
      url: `https://app.ASCENDynamics.org/account/${account.id}`,
      image: account.iconImage || "https://app.ASCENDynamics.org/assets/icon/logo.png"
    }, {
      card: "summary_large_image",
      title: `${account.name}`,
      description: descriptionPrefix,
      image: account.iconImage || "https://app.ASCENDynamics.org/assets/icon/logo.png"
    });
  }
  setDefaultMeta() {
    this.metaService.updateMetaTags("Profile | ASCENDynamics NFP", "View and manage your profile details, volunteering history, and preferences on ASCENDynamics NFP.", "profile, volunteer, community, nonprofits", {
      title: "Profile | ASCENDynamics NFP",
      description: "Manage your profile and connect with volunteering opportunities on ASCENDynamics NFP.",
      url: "https://app.ASCENDynamics.org/",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    }, {
      card: "summary",
      title: "Profile | ASCENDynamics NFP",
      description: "Customize your profile and stay connected with your community.",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    });
  }
}
_DetailsPage = DetailsPage;
_DetailsPage.ɵfac = function DetailsPage_Factory(t) {
  return new (t || _DetailsPage)(_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdirectiveInject"](_core_services_meta_service__WEBPACK_IMPORTED_MODULE_3__.MetaService), _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_19__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_19__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_20__.Store));
};
_DetailsPage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdefineComponent"]({
  type: _DetailsPage,
  selectors: [["app-details"]],
  viewQuery: function DetailsPage_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵviewQuery"](_ionic_angular__WEBPACK_IMPORTED_MODULE_21__.IonContent, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵloadQuery"]()) && (ctx.content = _t.first);
    }
  },
  decls: 4,
  vars: 4,
  consts: [["loading", ""], [4, "ngIf", "ngIfElse"], [3, "title"], [3, "fullscreen"], ["id", "profile", 3, "account", "isProfileOwner"], [1, "tabs"], [1, "tab-link", 3, "click"], ["class", "tab-link", 3, "click", 4, "ngIf"], [3, "account"], ["id", "contact", 3, "account"], ["id", "professional", 3, "professionalInfo", 4, "ngIf"], ["id", "users", "type", "user", 3, "account", "relatedAccounts"], ["id", "groups", "type", "group", 3, "account", "relatedAccounts"], ["id", "listings", "relationship", "owner", 3, "account", "relatedListings"], ["id", "volunteer", 3, "volunteerPreferences", 4, "ngIf"], ["id", "mutual-aid", 3, "mutualAidCommunityEngagement", 4, "ngIf"], ["id", "professional", 3, "professionalInfo"], ["id", "volunteer", 3, "volunteerPreferences"], ["id", "mutual-aid", 3, "mutualAidCommunityEngagement"]],
  template: function DetailsPage_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtemplate"](0, DetailsPage_ng_container_0_Template, 30, 30, "ng-container", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](1, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtemplate"](2, DetailsPage_ng_template_2_Template, 2, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtemplateRefExtractor"]);
    }
    if (rf & 2) {
      const loading_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵreference"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind1"](1, 2, ctx.account$))("ngIfElse", loading_r7);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_22__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_21__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_21__.IonHeader, _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_4__.AppHeaderComponent, _components_contact_information_contact_information_component__WEBPACK_IMPORTED_MODULE_5__.ContactInformationComponent, _components_hero_hero_component__WEBPACK_IMPORTED_MODULE_6__.HeroComponent, _components_professional_info_professional_info_component__WEBPACK_IMPORTED_MODULE_7__.ProfessionalInfoComponent, _components_related_accounts_related_accounts_component__WEBPACK_IMPORTED_MODULE_8__.RelatedAccountsComponent, _components_volunteer_preference_info_volunteer_preference_info_component__WEBPACK_IMPORTED_MODULE_9__.VolunteerPreferenceInfoComponent, _components_profile_profile_component__WEBPACK_IMPORTED_MODULE_10__.ProfileComponent, _components_mutual_aid_community_info_mutual_aid_community_info_component__WEBPACK_IMPORTED_MODULE_11__.MutualAidCommunityInfoComponent, _components_related_listings_related_listings_component__WEBPACK_IMPORTED_MODULE_12__.RelatedListingsComponent, _angular_common__WEBPACK_IMPORTED_MODULE_22__.AsyncPipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.tabs[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-around;\n  margin-bottom: 1rem;\n  border-bottom: 2px solid var(--ion-color-primary);\n}\n\n.tab-link[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  padding: 0.75rem 1rem;\n  text-align: center;\n  text-decoration: none;\n  color: var(--ion-color-primary);\n  cursor: pointer;\n  border-radius: 4px 4px 0 0;\n  margin: 0 2px;\n}\n\n.tab-link[_ngcontent-%COMP%]:hover, .tab-link[_ngcontent-%COMP%]:focus, .tab-link.active[_ngcontent-%COMP%] {\n  background-color: var(--ion-color-primary);\n  color: white;\n  outline: none;\n}\n\n@media (max-width: 600px) {\n  .tab-link[_ngcontent-%COMP%] {\n    flex: 1 1 100%;\n    margin-bottom: 2px;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2RldGFpbHMvZGV0YWlscy5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQTtBQW1CQTtFQUNFLGFBQUE7RUFDQSxlQUFBO0VBQ0EsNkJBQUE7RUFDQSxtQkFBQTtFQUNBLGlEQUFBO0FBQ0Y7O0FBRUE7RUFDRSxjQUFBO0VBQ0EscUJBQUE7RUFDQSxrQkFBQTtFQUNBLHFCQUFBO0VBQ0EsK0JBQUE7RUFDQSxlQUFBO0VBRUEsMEJBQUE7RUFDQSxhQUFBO0FBQUY7O0FBSUE7OztFQUdFLDBDQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7QUFERjs7QUFJQTtFQUNFO0lBQ0UsY0FBQTtJQUNBLGtCQUFBO0VBREY7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLnRhYnMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICBib3JkZXItYm90dG9tOiAycHggc29saWQgdmFyKC0taW9uLWNvbG9yLXByaW1hcnkpO1xufVxuXG4udGFiLWxpbmsge1xuICBmbGV4OiAxIDEgYXV0bztcbiAgcGFkZGluZzogMC43NXJlbSAxcmVtO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgY29sb3I6IHZhcigtLWlvbi1jb2xvci1wcmltYXJ5KTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICAvLyBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1pb24tY29sb3ItcHJpbWFyeSk7XG4gIGJvcmRlci1yYWRpdXM6IDRweCA0cHggMCAwO1xuICBtYXJnaW46IDAgMnB4O1xuICAvLyBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1pb24tY29sb3ItbGlnaHQpO1xufVxuXG4udGFiLWxpbms6aG92ZXIsXG4udGFiLWxpbms6Zm9jdXMsXG4udGFiLWxpbmsuYWN0aXZlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taW9uLWNvbG9yLXByaW1hcnkpO1xuICBjb2xvcjogd2hpdGU7XG4gIG91dGxpbmU6IG5vbmU7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkge1xuICAudGFiLWxpbmsge1xuICAgIGZsZXg6IDEgMSAxMDAlO1xuICAgIG1hcmdpbi1ib3R0b206IDJweDtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 4031:
/*!****************************************************************************************************!*\
  !*** ./src/app/modules/account/pages/edit/components/basic-info-form/basic-info-form.component.ts ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BasicInfoFormComponent: () => (/* binding */ BasicInfoFormComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../state/actions/account.actions */ 8314);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _BasicInfoFormComponent;







function BasicInfoFormComponent_ion_note_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "ion-note", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " This field is required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BasicInfoFormComponent_ion_note_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "ion-note", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " This field is required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BasicInfoFormComponent_ion_row_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "ion-row", 15)(1, "ion-col")(2, "ion-select", 16)(3, "ion-select-option", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Nonprofit");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "ion-select-option", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "Community");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "ion-select-option", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "Business");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "ion-select-option", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "Government");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "ion-select-option", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "Other");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
  }
}
function BasicInfoFormComponent_ion_grid_22_ion_note_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please enter a valid URL including http:// or https:// ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BasicInfoFormComponent_ion_grid_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "ion-grid", 22)(1, "ion-row")(2, "ion-col")(3, "ion-select", 23)(4, "ion-select-option", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "Social Media");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "ion-select-option", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "Donation");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "ion-select-option", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "Hobbies");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "ion-select-option", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "Publications");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "ion-select-option", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "Portfolio");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "ion-select-option", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "Personal Website");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "ion-select-option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, "External Resources");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "ion-select-option", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, "Other");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](21, "ion-input", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](23, "ion-input", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](24, BasicInfoFormComponent_ion_grid_22_ion_note_24_Template, 2, 0, "ion-note", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "ion-col", 34)(26, "ion-button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BasicInfoFormComponent_ion_grid_22_Template_ion_button_click_26_listener() {
      const i_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r1).index;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r2.removeWebLink(i_r2));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](27, "ion-icon", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const linkControl_r4 = ctx.$implicit;
    const i_r2 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroupName", i_r2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_4_0 = linkControl_r4.get("url")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = linkControl_r4.get("url")) == null ? null : tmp_4_0.touched));
  }
}
class BasicInfoFormComponent {
  constructor(fb, store) {
    this.fb = fb;
    this.store = store;
    this.account = null;
    this.maxLinks = 10;
    // Initialize the form in ngOnInit after fb is initialized
    this.basicInfoForm = this.fb.group({
      description: [""],
      tagline: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required],
      name: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required],
      webLinks: this.fb.array([this.createWebLinkFormGroup()]),
      groupDetails: this.fb.group({
        groupType: [""]
      })
    });
  }
  ngOnChanges(changes) {
    if (changes["account"] && this.account) {
      this.loadFormData();
    }
  }
  /**
   * Returns the FormArray for the webLinks control in the basicInfoForm.
   * @returns {FormArray} The FormArray for the webLinks control.
   */
  get webLinksFormArray() {
    return this.basicInfoForm.get("webLinks");
  }
  createWebLinkFormGroup() {
    return this.fb.group({
      name: ["", []],
      url: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.pattern(/^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/?].*)?$/)]],
      category: [""]
    });
  }
  onSubmit() {
    if (this.account) {
      var _formValue$descriptio, _formValue$webLinks$m, _formValue$webLinks, _formValue$groupDetai;
      const formValue = this.basicInfoForm.value;
      const updatedAccount = {
        ...this.account,
        ...formValue,
        name: formValue.name,
        tagline: formValue.tagline,
        description: (_formValue$descriptio = formValue.description) !== null && _formValue$descriptio !== void 0 ? _formValue$descriptio : "",
        webLinks: (_formValue$webLinks$m = (_formValue$webLinks = formValue.webLinks) === null || _formValue$webLinks === void 0 ? void 0 : _formValue$webLinks.map(link => {
          var _link$category;
          return {
            name: link.name,
            url: link.url,
            category: (_link$category = link.category) !== null && _link$category !== void 0 ? _link$category : ""
          };
        })) !== null && _formValue$webLinks$m !== void 0 ? _formValue$webLinks$m : [],
        groupDetails: {
          ...formValue.groupDetails,
          groupType: ((_formValue$groupDetai = formValue.groupDetails) === null || _formValue$groupDetai === void 0 ? void 0 : _formValue$groupDetai.groupType) || "Nonprofit"
        }
      };
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.updateAccount({
        account: updatedAccount
      }));
    }
  }
  loadFormData() {
    var _this$account$webLink, _this$account, _this$account2;
    if (!this.account) return;
    while (this.webLinksFormArray.length !== 0) {
      this.webLinksFormArray.removeAt(0);
    }
    (_this$account$webLink = this.account.webLinks) === null || _this$account$webLink === void 0 || _this$account$webLink.forEach(webLink => {
      this.webLinksFormArray.push(this.fb.group({
        name: [webLink.name],
        url: [webLink.url, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.pattern(/^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/?].*)?$/)]],
        category: [webLink.category]
      }));
    });
    if (this.webLinksFormArray.length === 0) {
      this.addWebLink();
    }
    this.basicInfoForm.patchValue({
      name: this.account.name,
      description: this.account.description,
      tagline: this.account.tagline
    });
    if (((_this$account = this.account) === null || _this$account === void 0 ? void 0 : _this$account.type) === "group" && (_this$account2 = this.account) !== null && _this$account2 !== void 0 && (_this$account2 = _this$account2.groupDetails) !== null && _this$account2 !== void 0 && _this$account2.groupType) {
      var _this$basicInfoForm$g, _this$account$groupDe;
      (_this$basicInfoForm$g = this.basicInfoForm.get("groupDetails.groupType")) === null || _this$basicInfoForm$g === void 0 || _this$basicInfoForm$g.setValue((_this$account$groupDe = this.account.groupDetails) === null || _this$account$groupDe === void 0 ? void 0 : _this$account$groupDe.groupType);
    }
  }
  addWebLink() {
    if (this.webLinksFormArray.length < this.maxLinks) {
      this.webLinksFormArray.push(this.createWebLinkFormGroup());
    }
  }
  removeWebLink(index) {
    this.webLinksFormArray.removeAt(index);
  }
}
_BasicInfoFormComponent = BasicInfoFormComponent;
_BasicInfoFormComponent.ɵfac = function BasicInfoFormComponent_Factory(t) {
  return new (t || _BasicInfoFormComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_3__.Store));
};
_BasicInfoFormComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
  type: _BasicInfoFormComponent,
  selectors: [["app-basic-info-form"]],
  inputs: {
    account: "account"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵNgOnChangesFeature"]],
  decls: 30,
  vars: 8,
  consts: [[3, "ngSubmit", "formGroup"], ["slot", "header"], ["slot", "content"], ["label", "Name", "label-placement", "floating", "fill", "outline", "type", "text", "inputmode", "text", "formControlName", "name", "minlength", "1", "maxlength", "255", "placeholder", "Enter Name"], ["color", "danger", 4, "ngIf"], ["formControlName", "tagline", "minlength", "1", "maxlength", "255", "label", "Tagline", "label-placement", "floating", "fill", "outline", "placeholder", "Enter Tagline"], ["formGroupName", "groupDetails", 4, "ngIf"], ["label", "Description", "label-placement", "floating", "fill", "outline", "placeholder", "Enter Description", "formControlName", "description", "rows", "8", "minlength", "0", "maxlength", "1000", 3, "counter"], ["color", "tertiary"], ["formArrayName", "webLinks"], [3, "formGroupName", 4, "ngFor", "ngForOf"], ["fill", "clear", 3, "click", "disabled"], ["slot", "start", "name", "add-circle-outline"], ["type", "submit", "expand", "float", 1, "custom-ion-button", 3, "disabled"], ["color", "danger"], ["formGroupName", "groupDetails"], ["label", "Group Type", "label-placement", "stacked", "formControlName", "groupType", "interface", "popover", "placeholder", "Select One", "fill", "outline"], ["value", "Nonprofit"], ["value", "Community"], ["value", "Business"], ["value", "Government"], ["value", "Other"], [3, "formGroupName"], ["label", "Category", "label-placement", "stacked", "fill", "outline", "formControlName", "category", "interface", "popover", "placeholder", "Select One"], ["value", "Social Media"], ["value", "Donation"], ["value", "Hobbies"], ["value", "Publications"], ["value", "Portfolio"], ["value", "Personal Website"], ["value", "External Resources"], ["label", "Name", "label-placement", "floating", "fill", "outline", "formControlName", "name", "type", "text"], ["label", "URL", "label-placement", "floating", "fill", "outline", "formControlName", "url", "type", "text", "minlength", "0", "maxlength", "100"], [4, "ngIf"], ["size", "1"], ["fill", "clear", 3, "click"], ["slot", "icon-only", "name", "trash-outline", 1, "remove-icon"]],
  template: function BasicInfoFormComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "form", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function BasicInfoFormComponent_Template_form_ngSubmit_0_listener() {
        return ctx.onSubmit();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "ion-item", 1)(2, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Basic Information");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 2)(5, "ion-grid")(6, "ion-row")(7, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](8, "ion-input", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](9, BasicInfoFormComponent_ion_note_9_Template, 2, 0, "ion-note", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "ion-row")(11, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](12, "ion-input", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](13, BasicInfoFormComponent_ion_note_13_Template, 2, 0, "ion-note", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](14, BasicInfoFormComponent_ion_row_14_Template, 13, 0, "ion-row", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "ion-row")(16, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](17, "ion-textarea", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "ion-item-divider")(19, "ion-label", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "Web Links");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "div", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](22, BasicInfoFormComponent_ion_grid_22_Template, 28, 2, "ion-grid", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "ion-button", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BasicInfoFormComponent_Template_ion_button_click_23_listener() {
        return ctx.addWebLink();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](24, "ion-icon", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](25, " Add Link ");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "ion-row")(27, "ion-col")(28, "ion-button", 13);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](29, " Save ");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_2_0;
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx.basicInfoForm);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_1_0 = ctx.basicInfoForm.get("name")) == null ? null : tmp_1_0.invalid) && ((tmp_1_0 = ctx.basicInfoForm.get("name")) == null ? null : tmp_1_0.touched));
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_2_0 = ctx.basicInfoForm.get("tagline")) == null ? null : tmp_2_0.invalid) && ((tmp_2_0 = ctx.basicInfoForm.get("tagline")) == null ? null : tmp_2_0.touched));
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (ctx.account == null ? null : ctx.account.type) === "group");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("counter", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.webLinksFormArray.controls);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.webLinksFormArray.controls.length >= ctx.maxLinks);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.basicInfoForm.invalid);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.MaxLengthValidator, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonInput, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonItemDivider, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonNote, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonSelect, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonSelectOption, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonTextarea, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.SelectValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.TextValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupName, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormArrayName],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2VkaXQvY29tcG9uZW50cy9iYXNpYy1pbmZvLWZvcm0vYmFzaWMtaW5mby1mb3JtLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0ZBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtOiBBbGxvd2luZyBVc2VycyBhbmQgT3JnYW5pemF0aW9ucyB0byBDb2xsYWJvcmF0ZS5cbiogQ29weXJpZ2h0IChDKSAyMDIzICBBU0NFTkR5bmFtaWNzIE5GUFxuKlxuKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uXG4qXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4qIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZFxuKiBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4qIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4qIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuKiBhbG9uZyB3aXRoIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ }),

/***/ 59:
/*!********************************************************************************************************!*\
  !*** ./src/app/modules/account/pages/edit/components/contact-info-form/contact-info-form.component.ts ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContactInfoFormComponent: () => (/* binding */ ContactInfoFormComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../state/actions/account.actions */ 8314);
/* harmony import */ var _core_data_phone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../core/data/phone */ 2985);
/* harmony import */ var _core_data_country__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../core/data/country */ 3095);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _ContactInfoFormComponent;









function ContactInfoFormComponent_div_12_ion_note_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid email ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function ContactInfoFormComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 12)(1, "ion-grid")(2, "ion-row")(3, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "ion-input", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](6, "ion-input", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, ContactInfoFormComponent_div_12_ion_note_7_Template, 2, 0, "ion-note", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "ion-col", 16)(9, "ion-button", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ContactInfoFormComponent_div_12_Template_ion_button_click_9_listener() {
      const i_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1).index;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r2.removeEmail(i_r2));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](10, "ion-icon", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const emailControl_r4 = ctx.$implicit;
    const i_r2 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroupName", i_r2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_4_0 = emailControl_r4.get("email")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = emailControl_r4.get("email")) == null ? null : tmp_4_0.touched));
  }
}
function ContactInfoFormComponent_div_22_ion_select_option_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-select-option", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const code_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", code_r6.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](code_r6.label);
  }
}
function ContactInfoFormComponent_div_22_ion_note_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid phone number ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function ContactInfoFormComponent_div_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 12)(1, "ion-grid")(2, "ion-row")(3, "ion-col", 20)(4, "ion-select", 21)(5, "ion-select-option", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "Mobile");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "ion-select-option", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8, "Home");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "ion-select-option", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](10, "Work");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "ion-col", 20)(12, "ion-select", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](13, ContactInfoFormComponent_div_22_ion_select_option_13_Template, 2, 2, "ion-select-option", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "ion-col", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](15, "ion-input", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](16, ContactInfoFormComponent_div_22_ion_note_16_Template, 2, 0, "ion-note", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "ion-row")(18, "ion-col", 30)(19, "ion-item", 31)(20, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](21, "Emergency Contact");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](22, "ion-checkbox", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](23, "ion-col", 16)(24, "ion-button", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ContactInfoFormComponent_div_22_Template_ion_button_click_24_listener() {
      const i_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r5).index;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r2.removePhoneNumber(i_r7));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](25, "ion-icon", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    let tmp_5_0;
    const phoneControl_r8 = ctx.$implicit;
    const i_r7 = ctx.index;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroupName", i_r7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r2.countryCodes);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_5_0 = phoneControl_r8.get("number")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = phoneControl_r8.get("number")) == null ? null : tmp_5_0.touched));
  }
}
function ContactInfoFormComponent_div_32_ion_note_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid address ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function ContactInfoFormComponent_div_32_ion_note_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid city name ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function ContactInfoFormComponent_div_32_ion_select_option_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-select-option", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const code_r10 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", code_r10.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](code_r10.label);
  }
}
function ContactInfoFormComponent_div_32_ion_select_option_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-select-option", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const code_r11 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", code_r11.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](code_r11.label);
  }
}
function ContactInfoFormComponent_div_32_ion_note_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid zip code ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function ContactInfoFormComponent_div_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 12)(1, "ion-grid")(2, "ion-row")(3, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "ion-input", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "ion-row")(6, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](7, "ion-input", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](8, ContactInfoFormComponent_div_32_ion_note_8_Template, 2, 0, "ion-note", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "ion-row")(10, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](11, "ion-input", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](12, ContactInfoFormComponent_div_32_ion_note_12_Template, 2, 0, "ion-note", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "ion-row")(14, "ion-col")(15, "ion-select", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](16, ContactInfoFormComponent_div_32_ion_select_option_16_Template, 2, 2, "ion-select-option", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "ion-row")(18, "ion-col")(19, "ion-select", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](20, ContactInfoFormComponent_div_32_ion_select_option_20_Template, 2, 2, "ion-select-option", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](21, "ion-row")(22, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](23, "ion-input", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](24, ContactInfoFormComponent_div_32_ion_note_24_Template, 2, 0, "ion-note", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](25, "ion-row")(26, "ion-col", 30)(27, "ion-item", 31)(28, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](29, "Primary Address");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](30, "ion-checkbox", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](31, "ion-col", 16)(32, "ion-button", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ContactInfoFormComponent_div_32_Template_ion_button_click_32_listener() {
      const i_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r9).index;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r2.removeAddress(i_r12));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](33, "ion-icon", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    let tmp_8_0;
    const addressControl_r13 = ctx.$implicit;
    const i_r12 = ctx.index;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroupName", i_r12);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_4_0 = addressControl_r13.get("street")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = addressControl_r13.get("street")) == null ? null : tmp_4_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_5_0 = addressControl_r13.get("city")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = addressControl_r13.get("city")) == null ? null : tmp_5_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r2.countries);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r2.statesProvinces);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_8_0 = addressControl_r13.get("zipcode")) == null ? null : tmp_8_0.invalid) && ((tmp_8_0 = addressControl_r13.get("zipcode")) == null ? null : tmp_8_0.touched));
  }
}
class ContactInfoFormComponent {
  constructor(fb, store) {
    this.fb = fb;
    this.store = store;
    this.countries = _core_data_country__WEBPACK_IMPORTED_MODULE_2__.countries;
    this.countryCodes = _core_data_phone__WEBPACK_IMPORTED_MODULE_1__.countryCodes.sort((a, b) => Number(a.value) > Number(b.value) ? 1 : -1);
    this.statesProvinces = _core_data_country__WEBPACK_IMPORTED_MODULE_2__.statesProvinces;
    this.maxAddresses = 3; // Set maximum number of addresses
    this.maxEmails = 5;
    this.maxPhoneNumbers = 5;
    this.account = null;
    this.contactInfoForm = this.fb.group({
      contactInformation: this.fb.group({
        emails: this.fb.array([this.createEmailFormGroup()]),
        phoneNumbers: this.fb.array([this.createPhoneNumberFormGroup()]),
        addresses: this.fb.array([this.createAddressFormGroup()]),
        preferredMethodOfContact: ["Email"]
      })
    });
  }
  ngOnChanges(changes) {
    if (changes["account"] && this.account) {
      this.loadFormData();
    }
  }
  get phoneNumbersFormArray() {
    return this.contactInfoForm.get("contactInformation.phoneNumbers");
  }
  get emailsFormArray() {
    return this.contactInfoForm.get("contactInformation.emails");
  }
  get addressesFormArray() {
    return this.contactInfoForm.get("contactInformation.addresses");
  }
  onSubmit() {
    if (this.contactInfoForm.valid && this.account) {
      const formValue = this.contactInfoForm.value.contactInformation;
      const updatedAccount = {
        ...this.account,
        contactInformation: {
          ...formValue,
          emails: formValue.emails.map(email => {
            var _email$name;
            return {
              name: (_email$name = email.name) !== null && _email$name !== void 0 ? _email$name : null,
              email: email.email
            };
          }),
          phoneNumbers: formValue.phoneNumbers.map(phone => {
            var _phone$countryCode, _phone$number, _phone$type;
            return {
              countryCode: (_phone$countryCode = phone.countryCode) !== null && _phone$countryCode !== void 0 ? _phone$countryCode : null,
              number: (_phone$number = phone.number) !== null && _phone$number !== void 0 ? _phone$number : null,
              type: (_phone$type = phone.type) !== null && _phone$type !== void 0 ? _phone$type : null,
              isEmergencyNumber: phone.isEmergencyNumber || false
            };
          }),
          addresses: formValue.addresses.map(address => {
            var _address$name, _address$street, _address$city, _address$state, _address$zipcode, _address$country;
            return {
              name: (_address$name = address === null || address === void 0 ? void 0 : address.name) !== null && _address$name !== void 0 ? _address$name : null,
              street: (_address$street = address === null || address === void 0 ? void 0 : address.street) !== null && _address$street !== void 0 ? _address$street : null,
              city: (_address$city = address === null || address === void 0 ? void 0 : address.city) !== null && _address$city !== void 0 ? _address$city : null,
              state: (_address$state = address === null || address === void 0 ? void 0 : address.state) !== null && _address$state !== void 0 ? _address$state : null,
              zipcode: (_address$zipcode = address === null || address === void 0 ? void 0 : address.zipcode) !== null && _address$zipcode !== void 0 ? _address$zipcode : null,
              country: (_address$country = address === null || address === void 0 ? void 0 : address.country) !== null && _address$country !== void 0 ? _address$country : null,
              isPrimaryAddress: (address === null || address === void 0 ? void 0 : address.isPrimaryAddress) || false
            };
          })
        }
      };
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.updateAccount({
        account: updatedAccount
      }));
    }
  }
  loadFormData() {
    var _contactInfo$emails, _contactInfo$phoneNum, _contactInfo$addresse;
    if (!this.account) return;
    const contactInfo = this.account.contactInformation;
    this.resetFormArrays();
    contactInfo === null || contactInfo === void 0 || (_contactInfo$emails = contactInfo.emails) === null || _contactInfo$emails === void 0 || _contactInfo$emails.forEach(email => {
      this.emailsFormArray.push(this.fb.group({
        name: [email.name],
        email: [email.email, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.email]
      }));
    });
    if (this.emailsFormArray.length === 0) {
      this.addEmail();
    }
    contactInfo === null || contactInfo === void 0 || (_contactInfo$phoneNum = contactInfo.phoneNumbers) === null || _contactInfo$phoneNum === void 0 || _contactInfo$phoneNum.forEach(phone => {
      this.phoneNumbersFormArray.push(this.fb.group({
        countryCode: [phone.countryCode],
        number: [phone.number, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^\\d{10}$")]],
        type: [phone.type],
        isEmergencyNumber: [phone.isEmergencyNumber]
      }));
    });
    if (this.phoneNumbersFormArray.length === 0) {
      this.addPhoneNumber();
    }
    contactInfo === null || contactInfo === void 0 || (_contactInfo$addresse = contactInfo.addresses) === null || _contactInfo$addresse === void 0 || _contactInfo$addresse.forEach(address => {
      this.addressesFormArray.push(this.fb.group({
        name: [address === null || address === void 0 ? void 0 : address.name],
        street: [address === null || address === void 0 ? void 0 : address.street, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[a-zA-Z0-9\\s,]*$")],
        city: [address === null || address === void 0 ? void 0 : address.city, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[a-zA-Z\\s]*$")],
        state: [address === null || address === void 0 ? void 0 : address.state],
        zipcode: [address === null || address === void 0 ? void 0 : address.zipcode, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[0-9]*$")],
        country: [address === null || address === void 0 ? void 0 : address.country],
        isPrimaryAddress: [address === null || address === void 0 ? void 0 : address.isPrimaryAddress]
      }));
    });
    if (this.addressesFormArray.length === 0) {
      this.addAddress();
    }
    this.contactInfoForm.patchValue({
      contactInformation: {
        preferredMethodOfContact: (contactInfo === null || contactInfo === void 0 ? void 0 : contactInfo.preferredMethodOfContact) || "Email"
      }
    });
  }
  resetFormArrays() {
    while (this.emailsFormArray.length !== 0) {
      this.emailsFormArray.removeAt(0);
    }
    while (this.phoneNumbersFormArray.length !== 0) {
      this.phoneNumbersFormArray.removeAt(0);
    }
    while (this.addressesFormArray.length !== 0) {
      this.addressesFormArray.removeAt(0);
    }
  }
  addEmail() {
    if (this.emailsFormArray.length < this.maxEmails) {
      this.emailsFormArray.push(this.createEmailFormGroup());
    }
  }
  removeEmail(index) {
    this.emailsFormArray.removeAt(index);
  }
  createEmailFormGroup() {
    return this.fb.group({
      name: [""],
      email: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.email]]
    });
  }
  createPhoneNumberFormGroup() {
    return this.fb.group({
      countryCode: [""],
      number: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^\\d{10}$")]],
      type: [""],
      isEmergencyNumber: [false]
    });
  }
  addPhoneNumber() {
    if (this.phoneNumbersFormArray.length < this.maxPhoneNumbers) {
      this.phoneNumbersFormArray.push(this.createPhoneNumberFormGroup());
    }
  }
  removePhoneNumber(index) {
    this.phoneNumbersFormArray.removeAt(index);
  }
  createAddressFormGroup() {
    return this.fb.group({
      name: [""],
      street: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[a-zA-Z0-9\\s,]*$")],
      city: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[a-zA-Z\\s]*$")],
      state: [""],
      zipcode: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[0-9]*$")],
      country: [""],
      isPrimaryAddress: [false]
    });
  }
  addAddress() {
    this.addressesFormArray.push(this.createAddressFormGroup());
  }
  removeAddress(index) {
    this.addressesFormArray.removeAt(index);
  }
}
_ContactInfoFormComponent = ContactInfoFormComponent;
_ContactInfoFormComponent.ɵfac = function ContactInfoFormComponent_Factory(t) {
  return new (t || _ContactInfoFormComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_5__.Store));
};
_ContactInfoFormComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
  type: _ContactInfoFormComponent,
  selectors: [["app-contact-info-form"]],
  inputs: {
    account: "account"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵNgOnChangesFeature"]],
  decls: 40,
  vars: 8,
  consts: [[3, "ngSubmit", "formGroup"], ["slot", "header"], ["slot", "content"], ["formGroupName", "contactInformation"], ["color", "tertiary"], ["formArrayName", "emails"], [3, "formGroupName", 4, "ngFor", "ngForOf"], ["fill", "clear", 3, "click", "disabled"], ["slot", "start", "name", "add-circle-outline"], ["formArrayName", "phoneNumbers"], ["formArrayName", "addresses"], ["type", "submit", "expand", "float", 3, "disabled"], [3, "formGroupName"], ["label", "Name", "label-placement", "floating", "fill", "outline", "formControlName", "name", "type", "text", "minlength", "0", "maxlength", "50"], ["label", "Email", "label-placement", "floating", "fill", "outline", "formControlName", "email", "type", "email", "minlength", "0", "maxlength", "50"], ["color", "danger", 4, "ngIf"], ["size", "1"], ["fill", "clear", 3, "click"], ["slot", "icon-only", "name", "trash-outline", 1, "remove-icon"], ["color", "danger"], ["size", "3"], ["label", "Type", "label-placement", "stacked", "fill", "outline", "formControlName", "type", "interface", "popover", "placeholder", "Select One"], ["value", "Mobile"], ["value", "Home"], ["value", "Work"], ["formControlName", "countryCode", "label", "Country Code", "label-placement", "stacked", "placeholder", "Select One", "fill", "outline", "interface", "popover"], [3, "value", 4, "ngFor", "ngForOf"], ["size", "6"], ["label", "Number", "label-placement", "floating", "fill", "outline", "formControlName", "number", "type", "tel", "minlength", "0", "maxlength", "10"], [4, "ngIf"], ["size", "11"], ["lines", "none"], ["slot", "start", "formControlName", "isEmergencyNumber"], [3, "value"], ["label", "Address Name", "label-placement", "floating", "fill", "outline", "formControlName", "name", "type", "text", "minlength", "0", "maxlength", "50"], ["label", "Street Address", "label-placement", "floating", "fill", "outline", "formControlName", "street", "type", "text", "minlength", "0", "maxlength", "50"], ["label", "City", "label-placement", "floating", "fill", "outline", "formControlName", "city", "type", "text", "minlength", "0", "maxlength", "50"], ["formControlName", "country", "label", "Country", "label-placement", "stacked", "placeholder", "Select Country", "fill", "outline", "interface", "popover"], ["formControlName", "state", "label", "State", "label-placement", "stacked", "placeholder", "Select State", "fill", "outline", "interface", "popover"], ["label", "Zip/Postal Code", "label-placement", "floating", "fill", "outline", "formControlName", "zipcode", "type", "text", "minlength", "0", "maxlength", "5"], ["slot", "start", "formControlName", "isPrimaryAddress"]],
  template: function ContactInfoFormComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "form", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngSubmit", function ContactInfoFormComponent_Template_form_ngSubmit_0_listener() {
        return ctx.onSubmit();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "ion-item", 1)(2, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3, "Contact Information");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "div", 2)(5, "ion-grid", 3)(6, "ion-row")(7, "ion-col")(8, "ion-item-divider")(9, "ion-label", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](10, "Emails");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "div", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](12, ContactInfoFormComponent_div_12_Template, 11, 2, "div", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "ion-button", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ContactInfoFormComponent_Template_ion_button_click_13_listener() {
        return ctx.addEmail();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](14, "ion-icon", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](15, " Add Email ");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "ion-row")(17, "ion-col")(18, "ion-item-divider")(19, "ion-label", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](20, "Phone Numbers");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](21, "div", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](22, ContactInfoFormComponent_div_22_Template, 26, 3, "div", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](23, "ion-button", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ContactInfoFormComponent_Template_ion_button_click_23_listener() {
        return ctx.addPhoneNumber();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](24, "ion-icon", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](25, " Add Phone Number ");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](26, "ion-row")(27, "ion-col")(28, "ion-item-divider")(29, "ion-label", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](30, "Addresses");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](31, "div", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](32, ContactInfoFormComponent_div_32_Template, 34, 6, "div", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](33, "ion-button", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ContactInfoFormComponent_Template_ion_button_click_33_listener() {
        return ctx.addAddress();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](34, "ion-icon", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](35, " Add Address ");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](36, "ion-row")(37, "ion-col")(38, "ion-button", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](39, " Save ");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroup", ctx.contactInfoForm);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](12);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.emailsFormArray.controls);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.emailsFormArray.controls.length >= ctx.maxEmails);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](9);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.phoneNumbersFormArray.controls);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.phoneNumbersFormArray.controls.length >= ctx.maxPhoneNumbers);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](9);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.addressesFormArray.controls);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.addressesFormArray.controls.length >= ctx.maxAddresses);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.contactInfoForm.invalid);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.MaxLengthValidator, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonCheckbox, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonInput, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonItemDivider, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonNote, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonSelect, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonSelectOption, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.BooleanValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.SelectValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.TextValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormGroupName, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormArrayName],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2VkaXQvY29tcG9uZW50cy9jb250YWN0LWluZm8tZm9ybS9jb250YWN0LWluZm8tZm9ybS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OytGQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 2515:
/*!****************************************************************************************!*\
  !*** ./src/app/modules/account/pages/edit/components/edit-menu/edit-menu.component.ts ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EditMenuComponent: () => (/* binding */ EditMenuComponent)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _shared_components_image_upload_modal_image_upload_modal_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../shared/components/image-upload-modal/image-upload-modal.component */ 861);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 9191);

var _EditMenuComponent;
/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/





function EditMenuComponent_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "img", 9);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("src", ctx_r0.account == null ? null : ctx_r0.account.iconImage, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeUrl"]);
  }
}
function EditMenuComponent_ion_icon_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "ion-icon", 10);
  }
}
function EditMenuComponent_ion_item_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-item", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function EditMenuComponent_ion_item_17_Template_ion_item_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r2);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r0.selectItem("professional"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "ion-icon", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Professional Information");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("selected", ctx_r0.selectedItem === "professional");
  }
}
function EditMenuComponent_ion_item_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-item", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function EditMenuComponent_ion_item_18_Template_ion_item_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r3);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r0.selectItem("volunteer"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "ion-icon", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Volunteer Preferences");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("selected", ctx_r0.selectedItem === "volunteer");
  }
}
function EditMenuComponent_ion_item_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-item", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function EditMenuComponent_ion_item_19_Template_ion_item_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r4);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r0.selectItem("mutual aid"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "ion-icon", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Mutual Aid Community");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("selected", ctx_r0.selectedItem === "mutual aid");
  }
}
function EditMenuComponent_ion_item_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-item", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function EditMenuComponent_ion_item_20_Template_ion_item_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r5);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r0.selectItem("labor"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "ion-icon", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Labor Rights");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("selected", ctx_r0.selectedItem === "labor");
  }
}
class EditMenuComponent {
  constructor(modalController) {
    this.modalController = modalController;
    this.isProfileOwner = true;
    this.itemSelected = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.selectedItem = "basic";
  }
  openImageUploadModal() {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      var _this$account, _this$account2, _this$account3;
      if (!((_this$account = _this.account) !== null && _this$account !== void 0 && _this$account.id) || !_this.isProfileOwner) return;
      const modal = yield _this.modalController.create({
        component: _shared_components_image_upload_modal_image_upload_modal_component__WEBPACK_IMPORTED_MODULE_1__.ImageUploadModalComponent,
        componentProps: {
          collectionName: "accounts",
          docId: (_this$account2 = _this.account) === null || _this$account2 === void 0 ? void 0 : _this$account2.id,
          firestoreLocation: `accounts/${(_this$account3 = _this.account) === null || _this$account3 === void 0 ? void 0 : _this$account3.id}/profile`,
          maxHeight: 200,
          maxWidth: 200,
          fieldName: "iconImage"
        }
      });
      yield modal.present();
    })();
  }
  selectItem(item) {
    this.selectedItem = item;
    this.itemSelected.emit(item);
  }
}
_EditMenuComponent = EditMenuComponent;
_EditMenuComponent.ɵfac = function EditMenuComponent_Factory(t) {
  return new (t || _EditMenuComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_3__.ModalController));
};
_EditMenuComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: _EditMenuComponent,
  selectors: [["app-edit-menu"]],
  inputs: {
    account: "account",
    isProfileOwner: "isProfileOwner"
  },
  outputs: {
    itemSelected: "itemSelected"
  },
  decls: 21,
  vars: 11,
  consts: [[1, "profile-container"], [1, "profile-photo"], ["class", "profile-img", "alt", "Profile Photo", 3, "src", 4, "ngIf"], ["name", "person-circle-outline", "class", "profile-icon", 4, "ngIf"], ["fill", "clear", 3, "click"], [3, "click"], ["slot", "start", "name", "information-circle-outline"], ["slot", "start", "name", "mail-outline"], [3, "selected", "click", 4, "ngIf"], ["alt", "Profile Photo", 1, "profile-img", 3, "src"], ["name", "person-circle-outline", 1, "profile-icon"], ["slot", "start", "name", "briefcase-outline"], ["slot", "start", "name", "heart-outline"], ["slot", "start", "name", "medkit-outline"], ["slot", "start", "name", "hand-left-outline"]],
  template: function EditMenuComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, EditMenuComponent_img_2_Template, 1, 1, "img", 2)(3, EditMenuComponent_ion_icon_3_Template, 1, 0, "ion-icon", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "ion-button", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function EditMenuComponent_Template_ion_button_click_4_listener() {
        return ctx.openImageUploadModal();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "Upload photo");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "ion-list")(9, "ion-item", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function EditMenuComponent_Template_ion_item_click_9_listener() {
        return ctx.selectItem("basic");
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](10, "ion-icon", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12, "Basic Information");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "ion-item", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function EditMenuComponent_Template_ion_item_click_13_listener() {
        return ctx.selectItem("contact");
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](14, "ion-icon", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](15, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](16, "Contact Information");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](17, EditMenuComponent_ion_item_17_Template, 4, 2, "ion-item", 8)(18, EditMenuComponent_ion_item_18_Template, 4, 2, "ion-item", 8)(19, EditMenuComponent_ion_item_19_Template, 4, 2, "ion-item", 8)(20, EditMenuComponent_ion_item_20_Template, 4, 2, "ion-item", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.account == null ? null : ctx.account.iconImage);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !(ctx.account == null ? null : ctx.account.iconImage));
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx.account == null ? null : ctx.account.name);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("selected", ctx.selectedItem === "basic");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("selected", ctx.selectedItem === "contact");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (ctx.account == null ? null : ctx.account.type) === "user");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (ctx.account == null ? null : ctx.account.type) === "user");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (ctx.account == null ? null : ctx.account.type) === "user");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (ctx.account == null ? null : ctx.account.type) === "user");
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonList],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.profile-container[_ngcontent-%COMP%] {\n  text-align: center;\n}\n\n.profile-photo[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  margin-bottom: 20px;\n}\n\n.profile-icon[_ngcontent-%COMP%], .profile-img[_ngcontent-%COMP%] {\n  font-size: 100px;\n  color: var(--ion-color-medium);\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;\n  object-fit: cover;\n  margin-bottom: 10px;\n  border: 2px solid var(--ion-color-primary);\n}\n\nion-button[_ngcontent-%COMP%] {\n  --color: var(--ion-color-primary);\n}\n\nh2[_ngcontent-%COMP%] {\n  margin-top: 0;\n  font-size: 24px;\n  color: var(--ion-color-dark);\n}\n\nion-item[_ngcontent-%COMP%] {\n  --inner-padding-start: 0;\n  cursor: pointer;\n}\n\nion-item.selected[_ngcontent-%COMP%] {\n  border-bottom: 2px solid var(--ion-color-primary);\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2VkaXQvY29tcG9uZW50cy9lZGl0LW1lbnUvZWRpdC1tZW51LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0ZBQUE7QUFtQkE7RUFDRSxrQkFBQTtBQUNGOztBQUVBO0VBQ0UsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSxtQkFBQTtBQUNGOztBQUVBOztFQUVFLGdCQUFBO0VBQ0EsOEJBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtFQUNBLGtCQUFBO0VBQ0EsaUJBQUE7RUFDQSxtQkFBQTtFQUNBLDBDQUFBO0FBQ0Y7O0FBRUE7RUFDRSxpQ0FBQTtBQUNGOztBQUVBO0VBQ0UsYUFBQTtFQUNBLGVBQUE7RUFDQSw0QkFBQTtBQUNGOztBQUVBO0VBQ0Usd0JBQUE7RUFDQSxlQUFBO0FBQ0Y7O0FBRUE7RUFDRSxpREFBQTtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4ucHJvZmlsZS1jb250YWluZXIge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi5wcm9maWxlLXBob3RvIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWFyZ2luLWJvdHRvbTogMjBweDtcbn1cblxuLnByb2ZpbGUtaWNvbixcbi5wcm9maWxlLWltZyB7XG4gIGZvbnQtc2l6ZTogMTAwcHg7XG4gIGNvbG9yOiB2YXIoLS1pb24tY29sb3ItbWVkaXVtKTtcbiAgd2lkdGg6IDEwMHB4O1xuICBoZWlnaHQ6IDEwMHB4O1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIG9iamVjdC1maXQ6IGNvdmVyO1xuICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1pb24tY29sb3ItcHJpbWFyeSk7XG59XG5cbmlvbi1idXR0b24ge1xuICAtLWNvbG9yOiB2YXIoLS1pb24tY29sb3ItcHJpbWFyeSk7XG59XG5cbmgyIHtcbiAgbWFyZ2luLXRvcDogMDtcbiAgZm9udC1zaXplOiAyNHB4O1xuICBjb2xvcjogdmFyKC0taW9uLWNvbG9yLWRhcmspO1xufVxuXG5pb24taXRlbSB7XG4gIC0taW5uZXItcGFkZGluZy1zdGFydDogMDtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG5pb24taXRlbS5zZWxlY3RlZCB7XG4gIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCB2YXIoLS1pb24tY29sb3ItcHJpbWFyeSk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 2609:
/*!******************************************************************************************************************!*\
  !*** ./src/app/modules/account/pages/edit/components/labor-rights-info-form/labor-rights-info-form.component.ts ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LaborRightsInfoFormComponent: () => (/* binding */ LaborRightsInfoFormComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../state/actions/account.actions */ 8314);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _LaborRightsInfoFormComponent;







function LaborRightsInfoFormComponent_ion_select_option_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "ion-select-option", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const area_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", area_r1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", area_r1, " ");
  }
}
function LaborRightsInfoFormComponent_ion_select_option_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "ion-select-option", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const experience_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", experience_r2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", experience_r2, " ");
  }
}
class LaborRightsInfoFormComponent {
  constructor(fb, store) {
    this.fb = fb;
    this.store = store;
    this.advocacyAreasOptions = ["Healthcare", "Education", "Environment", "Labor Rights", "Technology"];
    this.laborRightsExperienceOptions = ["None", "Beginner", "Intermediate", "Expert"];
    this.laborRightsInfoForm = this.fb.group({
      unionMembership: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required],
      workplaceConcerns: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required],
      preferredAdvocacyAreas: [[], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required],
      experienceWithLaborRightsIssues: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required]
    });
  }
  ngOnInit() {
    if (this.account.laborRights) {
      this.loadFormData();
    }
  }
  loadFormData() {
    var _this$account$laborRi, _this$account$laborRi2, _this$account$laborRi3, _this$account$laborRi4;
    this.laborRightsInfoForm.patchValue({
      unionMembership: ((_this$account$laborRi = this.account.laborRights) === null || _this$account$laborRi === void 0 ? void 0 : _this$account$laborRi.unionMembership) || null,
      workplaceConcerns: ((_this$account$laborRi2 = this.account.laborRights) === null || _this$account$laborRi2 === void 0 ? void 0 : _this$account$laborRi2.workplaceConcerns) || "",
      preferredAdvocacyAreas: ((_this$account$laborRi3 = this.account.laborRights) === null || _this$account$laborRi3 === void 0 ? void 0 : _this$account$laborRi3.preferredAdvocacyAreas) || [],
      experienceWithLaborRightsIssues: ((_this$account$laborRi4 = this.account.laborRights) === null || _this$account$laborRi4 === void 0 ? void 0 : _this$account$laborRi4.experienceWithLaborRightsIssues) || null
    });
  }
  onSubmit() {
    if (this.laborRightsInfoForm.valid) {
      const laborRightsInfo = this.laborRightsInfoForm.value;
      const updatedAccount = {
        ...this.account,
        laborRights: laborRightsInfo
      };
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.updateAccount({
        account: updatedAccount
      }));
    }
  }
}
_LaborRightsInfoFormComponent = LaborRightsInfoFormComponent;
_LaborRightsInfoFormComponent.ɵfac = function LaborRightsInfoFormComponent_Factory(t) {
  return new (t || _LaborRightsInfoFormComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_3__.Store));
};
_LaborRightsInfoFormComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
  type: _LaborRightsInfoFormComponent,
  selectors: [["app-labor-rights-info-form"]],
  inputs: {
    account: "account"
  },
  decls: 39,
  vars: 4,
  consts: [[3, "ngSubmit", "formGroup"], ["slot", "header"], ["slot", "content"], ["lines", "none"], ["formControlName", "unionMembership"], ["slot", "start", "value", "yes"], ["slot", "start", "value", "no"], ["slot", "start", "value", "preferNotToSay"], ["formControlName", "workplaceConcerns", "label", "Workplace Concerns", "label-placement", "floating", "fill", "outline", "placeholder", "Enter your workplace concerns"], ["formControlName", "preferredAdvocacyAreas", "label", "Preferred Advocacy Areas", "label-placement", "floating", "fill", "outline", "interface", "popover", "multiple", "true", "placeholder", "Select advocacy areas"], [3, "value", 4, "ngFor", "ngForOf"], ["formControlName", "experienceWithLaborRightsIssues", "label", "Experience With Labor Rights Issues", "label-placement", "floating", "fill", "outline", "interface", "popover", "placeholder", "Select experience level"], ["type", "submit", "expand", "float", 3, "disabled"], [3, "value"]],
  template: function LaborRightsInfoFormComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "form", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function LaborRightsInfoFormComponent_Template_form_ngSubmit_0_listener() {
        return ctx.onSubmit();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "ion-item", 1)(2, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Labor Rights Information");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 2)(5, "ion-grid")(6, "ion-row")(7, "ion-col")(8, "ion-item", 3)(9, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "Union Membership");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "ion-radio-group", 4)(12, "ion-item", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](13, "ion-radio", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "Yes");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "ion-item", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](17, "ion-radio", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, "No");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "ion-item", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](21, "ion-radio", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, "Prefer not to say");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "ion-row")(25, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](26, "ion-input", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "ion-row")(28, "ion-col")(29, "ion-select", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](30, LaborRightsInfoFormComponent_ion_select_option_30_Template, 2, 2, "ion-select-option", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "ion-row")(32, "ion-col")(33, "ion-select", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](34, LaborRightsInfoFormComponent_ion_select_option_34_Template, 2, 2, "ion-select-option", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "ion-row")(36, "ion-col")(37, "ion-button", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](38, " Save ");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx.laborRightsInfoForm);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](30);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.advocacyAreasOptions);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.laborRightsExperienceOptions);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.laborRightsInfoForm.invalid);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonInput, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonRadio, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonRadioGroup, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonSelect, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonSelectOption, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.SelectValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.TextValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlName],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2VkaXQvY29tcG9uZW50cy9sYWJvci1yaWdodHMtaW5mby1mb3JtL2xhYm9yLXJpZ2h0cy1pbmZvLWZvcm0uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 7797:
/*!**********************************************************************************************************************************************!*\
  !*** ./src/app/modules/account/pages/edit/components/mutual-aid-community-engagement-form/mutual-aid-community-engagement-form.component.ts ***!
  \**********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MutualAidCommunityEngagementFormComponent: () => (/* binding */ MutualAidCommunityEngagementFormComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _core_data_options__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../core/data/options */ 3115);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../state/actions/account.actions */ 8314);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _MutualAidCommunityEngagementFormComponent;








function MutualAidCommunityEngagementFormComponent_ion_select_option_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-select-option", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const service_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", service_r1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", service_r1, " ");
  }
}
function MutualAidCommunityEngagementFormComponent_ion_select_option_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-select-option", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const service_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", service_r2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", service_r2, " ");
  }
}
function MutualAidCommunityEngagementFormComponent_ion_select_option_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-select-option", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const affiliation_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", affiliation_r3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", affiliation_r3, " ");
  }
}
function MutualAidCommunityEngagementFormComponent_ion_select_option_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-select-option", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const group_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", group_r4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", group_r4, " ");
  }
}
class MutualAidCommunityEngagementFormComponent {
  constructor(fb, store) {
    this.fb = fb;
    this.store = store;
    this.servicesOptions = _core_data_options__WEBPACK_IMPORTED_MODULE_0__.servicesOptions;
    this.communityAffiliationsOptions = _core_data_options__WEBPACK_IMPORTED_MODULE_0__.communityAffiliationsOptions;
    this.groupsOrForumsOptions = _core_data_options__WEBPACK_IMPORTED_MODULE_0__.groupsOrForumsOptions;
    this.mutualAidForm = this.fb.group({
      servicesOffered: [[], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required],
      servicesNeeded: [[]],
      communityAffiliations: [[], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required],
      willingnessToProvideMentorship: [false],
      interestInReceivingMentorship: [false],
      groupsOrForumsParticipation: [[]]
    });
  }
  ngOnInit() {
    if (this.account.mutualAidCommunityEngagement) {
      this.loadFormData();
    }
  }
  loadFormData() {
    var _this$account$mutualA, _this$account$mutualA2, _this$account$mutualA3, _this$account$mutualA4, _this$account$mutualA5, _this$account$mutualA6;
    this.mutualAidForm.patchValue({
      servicesOffered: ((_this$account$mutualA = this.account.mutualAidCommunityEngagement) === null || _this$account$mutualA === void 0 ? void 0 : _this$account$mutualA.servicesOffered) || [],
      servicesNeeded: ((_this$account$mutualA2 = this.account.mutualAidCommunityEngagement) === null || _this$account$mutualA2 === void 0 ? void 0 : _this$account$mutualA2.servicesNeeded) || [],
      communityAffiliations: ((_this$account$mutualA3 = this.account.mutualAidCommunityEngagement) === null || _this$account$mutualA3 === void 0 ? void 0 : _this$account$mutualA3.communityAffiliations) || [],
      willingnessToProvideMentorship: ((_this$account$mutualA4 = this.account.mutualAidCommunityEngagement) === null || _this$account$mutualA4 === void 0 ? void 0 : _this$account$mutualA4.willingnessToProvideMentorship) || false,
      interestInReceivingMentorship: ((_this$account$mutualA5 = this.account.mutualAidCommunityEngagement) === null || _this$account$mutualA5 === void 0 ? void 0 : _this$account$mutualA5.interestInReceivingMentorship) || false,
      groupsOrForumsParticipation: ((_this$account$mutualA6 = this.account.mutualAidCommunityEngagement) === null || _this$account$mutualA6 === void 0 ? void 0 : _this$account$mutualA6.groupsOrForumsParticipation) || []
    });
  }
  onSubmit() {
    if (this.mutualAidForm.valid) {
      const updatedMutualAidCommunityEngagement = this.mutualAidForm.value;
      const updatedAccount = {
        ...this.account,
        mutualAidCommunityEngagement: updatedMutualAidCommunityEngagement
      };
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_1__.updateAccount({
        account: updatedAccount
      }));
    }
  }
}
_MutualAidCommunityEngagementFormComponent = MutualAidCommunityEngagementFormComponent;
_MutualAidCommunityEngagementFormComponent.ɵfac = function MutualAidCommunityEngagementFormComponent_Factory(t) {
  return new (t || _MutualAidCommunityEngagementFormComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_4__.Store));
};
_MutualAidCommunityEngagementFormComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: _MutualAidCommunityEngagementFormComponent,
  selectors: [["app-mutual-aid-community-engagement-form"]],
  inputs: {
    account: "account"
  },
  decls: 38,
  vars: 6,
  consts: [[3, "ngSubmit", "formGroup"], ["slot", "header"], ["slot", "content"], ["formControlName", "servicesOffered", "label", "Services Offered", "label-placement", "floating", "fill", "outline", "interface", "popover", "multiple", "true", "placeholder", "Select services offered"], [3, "value", 4, "ngFor", "ngForOf"], ["formControlName", "servicesNeeded", "label", "Services Needed", "label-placement", "floating", "fill", "outline", "interface", "popover", "multiple", "true", "placeholder", "Select services needed"], ["formControlName", "communityAffiliations", "label", "Community Affiliations", "label-placement", "floating", "fill", "outline", "interface", "popover", "multiple", "true", "placeholder", "Select community affiliations"], ["formControlName", "willingnessToProvideMentorship", "slot", "start"], ["formControlName", "interestInReceivingMentorship", "slot", "start"], ["formControlName", "groupsOrForumsParticipation", "label", "Groups or Forums Participation", "label-placement", "floating", "fill", "outline", "interface", "popover", "multiple", "true", "placeholder", "Select groups or forums"], ["type", "submit", "expand", "float", 3, "disabled"], [3, "value"]],
  template: function MutualAidCommunityEngagementFormComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "form", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngSubmit", function MutualAidCommunityEngagementFormComponent_Template_form_ngSubmit_0_listener() {
        return ctx.onSubmit();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "ion-item", 1)(2, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Mutual Aid Community Engagement");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 2)(5, "ion-grid")(6, "ion-row")(7, "ion-col")(8, "ion-select", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](9, MutualAidCommunityEngagementFormComponent_ion_select_option_9_Template, 2, 2, "ion-select-option", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "ion-row")(11, "ion-col")(12, "ion-select", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](13, MutualAidCommunityEngagementFormComponent_ion_select_option_13_Template, 2, 2, "ion-select-option", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "ion-row")(15, "ion-col")(16, "ion-select", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](17, MutualAidCommunityEngagementFormComponent_ion_select_option_17_Template, 2, 2, "ion-select-option", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "ion-row")(19, "ion-col")(20, "ion-item")(21, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](22, "Willingness to Provide Mentorship");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](23, "ion-checkbox", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](24, "ion-row")(25, "ion-col")(26, "ion-item")(27, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](28, "Interest in Receiving Mentorship");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](29, "ion-checkbox", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](30, "ion-row")(31, "ion-col")(32, "ion-select", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](33, MutualAidCommunityEngagementFormComponent_ion_select_option_33_Template, 2, 2, "ion-select-option", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](34, "ion-row")(35, "ion-col")(36, "ion-button", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](37, " Save ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx.mutualAidForm);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](9);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.servicesOptions);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.servicesOptions);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.communityAffiliationsOptions);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](16);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.groupsOrForumsOptions);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.mutualAidForm.invalid);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonCheckbox, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonSelect, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonSelectOption, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.BooleanValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.SelectValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControlName],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2VkaXQvY29tcG9uZW50cy9tdXR1YWwtYWlkLWNvbW11bml0eS1lbmdhZ2VtZW50LWZvcm0vbXV0dWFsLWFpZC1jb21tdW5pdHktZW5nYWdlbWVudC1mb3JtLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0ZBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtOiBBbGxvd2luZyBVc2VycyBhbmQgT3JnYW5pemF0aW9ucyB0byBDb2xsYWJvcmF0ZS5cbiogQ29weXJpZ2h0IChDKSAyMDIzICBBU0NFTkR5bmFtaWNzIE5GUFxuKlxuKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uXG4qXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4qIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZFxuKiBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4qIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4qIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuKiBhbG9uZyB3aXRoIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ }),

/***/ 1923:
/*!******************************************************************************************************************!*\
  !*** ./src/app/modules/account/pages/edit/components/professional-info-form/professional-info-form.component.ts ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProfessionalInfoFormComponent: () => (/* binding */ ProfessionalInfoFormComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../state/actions/account.actions */ 8314);
/* harmony import */ var _core_data_options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../core/data/options */ 3115);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _ProfessionalInfoFormComponent;








function ProfessionalInfoFormComponent_ion_select_option_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-select-option", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const skill_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", skill_r1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](skill_r1);
  }
}
class ProfessionalInfoFormComponent {
  constructor(fb, store) {
    this.fb = fb;
    this.store = store;
    this.skillsOptions = _core_data_options__WEBPACK_IMPORTED_MODULE_1__.skillsOptions;
    this.professionalInformationForm = this.fb.group({
      occupation: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required],
      employerName: [""],
      workExperience: [""],
      skillsAndExpertise: [[], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required],
      currentJobTitle: [""],
      linkedInProfile: [""],
      educationalBackground: [""]
    });
  }
  ngOnInit() {
    var _this$account;
    if ((_this$account = this.account) !== null && _this$account !== void 0 && _this$account.professionalInformation) {
      this.loadFormData();
    }
  }
  loadFormData() {
    var _this$account2;
    if ((_this$account2 = this.account) !== null && _this$account2 !== void 0 && _this$account2.professionalInformation) {
      this.professionalInformationForm.patchValue({
        occupation: this.account.professionalInformation.occupation || "",
        employerName: this.account.professionalInformation.employerName || "",
        workExperience: this.account.professionalInformation.workExperience || "",
        skillsAndExpertise: this.account.professionalInformation.skillsAndExpertise || [],
        currentJobTitle: this.account.professionalInformation.currentJobTitle || "",
        linkedInProfile: this.account.professionalInformation.linkedInProfile || "",
        educationalBackground: this.account.professionalInformation.educationalBackground || ""
      });
    }
  }
  onSubmit() {
    if (this.professionalInformationForm.valid && this.account) {
      const updatedProfessionalInformation = this.professionalInformationForm.value;
      const updatedAccount = {
        ...this.account,
        professionalInformation: updatedProfessionalInformation
      };
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.updateAccount({
        account: updatedAccount
      }));
    }
  }
}
_ProfessionalInfoFormComponent = ProfessionalInfoFormComponent;
_ProfessionalInfoFormComponent.ɵfac = function ProfessionalInfoFormComponent_Factory(t) {
  return new (t || _ProfessionalInfoFormComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_4__.Store));
};
_ProfessionalInfoFormComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: _ProfessionalInfoFormComponent,
  selectors: [["app-professional-info-form"]],
  inputs: {
    account: "account"
  },
  decls: 32,
  vars: 5,
  consts: [[3, "ngSubmit", "formGroup"], ["slot", "header"], ["slot", "content"], ["formControlName", "employerName", "label", "Employer Name", "label-placement", "floating", "fill", "outline", "placeholder", "Enter your employer's name"], ["formControlName", "currentJobTitle", "label", "Current Job Title", "label-placement", "floating", "fill", "outline", "placeholder", "Enter your current job title"], ["formControlName", "occupation", "label", "Occupation", "label-placement", "floating", "fill", "outline", "placeholder", "Enter your occupation"], ["formControlName", "workExperience", "label", "Work Experience", "label-placement", "floating", "fill", "outline", "placeholder", "Describe your work experience", "rows", "6", "minlength", "0", "maxlength", "1000", 3, "counter"], ["formControlName", "skillsAndExpertise", "label", "Skills and Expertise", "label-placement", "floating", "fill", "outline", "interface", "popover", "multiple", "true"], [3, "value", 4, "ngFor", "ngForOf"], ["formControlName", "linkedInProfile", "label", "LinkedIn Profile", "label-placement", "floating", "fill", "outline", "placeholder", "Enter your LinkedIn profile URL"], ["formControlName", "educationalBackground", "label", "Educational Background", "label-placement", "floating", "fill", "outline", "placeholder", "Describe your educational background", "rows", "6", "minlength", "0", "maxlength", "1000", 3, "counter"], ["type", "submit", "expand", "float", 3, "disabled"], [3, "value"]],
  template: function ProfessionalInfoFormComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "form", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngSubmit", function ProfessionalInfoFormComponent_Template_form_ngSubmit_0_listener() {
        return ctx.onSubmit();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "ion-item", 1)(2, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Professional Information");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 2)(5, "ion-grid")(6, "ion-row")(7, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](8, "ion-input", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "ion-row")(10, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](11, "ion-input", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "ion-row")(13, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](14, "ion-input", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](15, "ion-row")(16, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](17, "ion-textarea", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "ion-row")(19, "ion-col")(20, "ion-select", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](21, ProfessionalInfoFormComponent_ion_select_option_21_Template, 2, 2, "ion-select-option", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](22, "ion-row")(23, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](24, "ion-input", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](25, "ion-row")(26, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](27, "ion-textarea", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](28, "ion-row")(29, "ion-col")(30, "ion-button", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](31, " Save ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx.professionalInformationForm);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](17);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("counter", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.skillsOptions);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("counter", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.professionalInformationForm.invalid);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MaxLengthValidator, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonInput, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonSelect, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonSelectOption, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonTextarea, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.SelectValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.TextValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControlName],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2VkaXQvY29tcG9uZW50cy9wcm9mZXNzaW9uYWwtaW5mby1mb3JtL3Byb2Zlc3Npb25hbC1pbmZvLWZvcm0uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 521:
/*!**********************************************************************************************************************************!*\
  !*** ./src/app/modules/account/pages/edit/components/volunteer-preference-info-form/volunteer-preference-info-form.component.ts ***!
  \**********************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VolunteerPreferenceInfoFormComponent: () => (/* binding */ VolunteerPreferenceInfoFormComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../state/actions/account.actions */ 8314);
/* harmony import */ var _core_data_options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../core/data/options */ 3115);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _VolunteerPreferenceInfoFormComponent;








function VolunteerPreferenceInfoFormComponent_ion_select_option_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-select-option", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const area_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("value", area_r1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](area_r1);
  }
}
class VolunteerPreferenceInfoFormComponent {
  constructor(fb, store) {
    this.fb = fb;
    this.store = store;
    this.areasOfInterestOptions = _core_data_options__WEBPACK_IMPORTED_MODULE_1__.areasOfInterestOptions;
    this.volunteerPreferencesForm = this.fb.group({
      areasOfInterest: [[], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required],
      availability: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required],
      preferredVolunteerRoles: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required],
      previousVolunteerExperience: [""],
      willingnessToTravel: [false],
      desiredLevelOfCommitment: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required]
    });
  }
  ngOnInit() {
    var _this$account;
    if ((_this$account = this.account) !== null && _this$account !== void 0 && _this$account.volunteerPreferences) {
      this.loadFormData();
    }
  }
  loadFormData() {
    var _this$account2;
    if ((_this$account2 = this.account) !== null && _this$account2 !== void 0 && _this$account2.volunteerPreferences) {
      this.volunteerPreferencesForm.patchValue({
        areasOfInterest: this.account.volunteerPreferences.areasOfInterest || [],
        availability: this.account.volunteerPreferences.availability || "",
        preferredVolunteerRoles: (this.account.volunteerPreferences.preferredVolunteerRoles || []).join(", "),
        previousVolunteerExperience: this.account.volunteerPreferences.previousVolunteerExperience || "",
        willingnessToTravel: this.account.volunteerPreferences.willingnessToTravel || false,
        desiredLevelOfCommitment: this.account.volunteerPreferences.desiredLevelOfCommitment || ""
      });
    }
  }
  onSubmit() {
    if (this.volunteerPreferencesForm.valid && this.account) {
      const updatedVolunteerPreferences = this.volunteerPreferencesForm.value;
      const updatedAccount = {
        ...this.account,
        volunteerPreferences: updatedVolunteerPreferences
      };
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.updateAccount({
        account: updatedAccount
      }));
    }
  }
}
_VolunteerPreferenceInfoFormComponent = VolunteerPreferenceInfoFormComponent;
_VolunteerPreferenceInfoFormComponent.ɵfac = function VolunteerPreferenceInfoFormComponent_Factory(t) {
  return new (t || _VolunteerPreferenceInfoFormComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_4__.Store));
};
_VolunteerPreferenceInfoFormComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: _VolunteerPreferenceInfoFormComponent,
  selectors: [["app-volunteer-preference-info-form"]],
  inputs: {
    account: "account"
  },
  decls: 44,
  vars: 3,
  consts: [[3, "ngSubmit", "formGroup"], ["slot", "header"], ["slot", "content"], ["formControlName", "areasOfInterest", "label", "Areas of Interest", "label-placement", "floating", "fill", "outline", "interface", "popover", "multiple", "true"], [3, "value", 4, "ngFor", "ngForOf"], ["formControlName", "availability", "label", "Availability", "label-placement", "floating", "fill", "outline", "interface", "popover", "multiple", "true"], ["value", "Weekdays"], ["value", "Weekends"], ["value", "Evenings"], ["formControlName", "preferredVolunteerRoles", "label", "Preferred Volunteer Roles", "label-placement", "floating", "fill", "outline", "placeholder", "Enter roles separated by commas"], ["formControlName", "previousVolunteerExperience", "label", "Previous Volunteer Experience", "label-placement", "floating", "fill", "outline", "placeholder", "Enter previous experience"], ["formControlName", "willingnessToTravel", "slot", "start"], ["formControlName", "desiredLevelOfCommitment", "label", "Level of Commitment", "label-placement", "floating", "fill", "outline", "interface", "popover"], ["value", "One-time"], ["value", "Occasional"], ["value", "Regular"], ["type", "submit", "expand", "float", 3, "disabled"], [3, "value"]],
  template: function VolunteerPreferenceInfoFormComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "form", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngSubmit", function VolunteerPreferenceInfoFormComponent_Template_form_ngSubmit_0_listener() {
        return ctx.onSubmit();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "ion-item", 1)(2, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Volunteer Preferences");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 2)(5, "ion-grid")(6, "ion-row")(7, "ion-col")(8, "ion-select", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](9, VolunteerPreferenceInfoFormComponent_ion_select_option_9_Template, 2, 2, "ion-select-option", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "ion-row")(11, "ion-col")(12, "ion-select", 5)(13, "ion-select-option", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](14, "Weekdays");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](15, "ion-select-option", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](16, "Weekends");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "ion-select-option", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](18, "Evenings");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "ion-row")(20, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](21, "ion-input", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](22, "ion-row")(23, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](24, "ion-input", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](25, "ion-row")(26, "ion-col")(27, "ion-item")(28, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](29, "Willingness to Travel");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](30, "ion-checkbox", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](31, "ion-row")(32, "ion-col")(33, "ion-select", 12)(34, "ion-select-option", 13);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](35, "One-time");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](36, "ion-select-option", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](37, "Occasional");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](38, "ion-select-option", 15);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](39, "Regular");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](40, "ion-row")(41, "ion-col")(42, "ion-button", 16);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](43, " Save ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx.volunteerPreferencesForm);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](9);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.areasOfInterestOptions);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](33);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.volunteerPreferencesForm.invalid);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonCheckbox, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonInput, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonSelect, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonSelectOption, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.BooleanValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.SelectValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.TextValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControlName],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2VkaXQvY29tcG9uZW50cy92b2x1bnRlZXItcHJlZmVyZW5jZS1pbmZvLWZvcm0vdm9sdW50ZWVyLXByZWZlcmVuY2UtaW5mby1mb3JtLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0ZBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtOiBBbGxvd2luZyBVc2VycyBhbmQgT3JnYW5pemF0aW9ucyB0byBDb2xsYWJvcmF0ZS5cbiogQ29weXJpZ2h0IChDKSAyMDIzICBBU0NFTkR5bmFtaWNzIE5GUFxuKlxuKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uXG4qXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4qIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZFxuKiBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4qIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4qIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuKiBhbG9uZyB3aXRoIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ }),

/***/ 5221:
/*!*********************************************************!*\
  !*** ./src/app/modules/account/pages/edit/edit.page.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EditPage: () => (/* binding */ EditPage)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! rxjs */ 1640);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs/operators */ 4406);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! rxjs/operators */ 1856);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs/operators */ 1969);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs/operators */ 5840);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! rxjs/operators */ 1082);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! rxjs/operators */ 5117);
/* harmony import */ var _state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../state/selectors/account.selectors */ 8686);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../state/actions/account.actions */ 8314);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _core_services_meta_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../core/services/meta.service */ 6369);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/components/app-header/app-header.component */ 8245);
/* harmony import */ var _components_edit_menu_edit_menu_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/edit-menu/edit-menu.component */ 2515);
/* harmony import */ var _components_basic_info_form_basic_info_form_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/basic-info-form/basic-info-form.component */ 4031);
/* harmony import */ var _components_contact_info_form_contact_info_form_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/contact-info-form/contact-info-form.component */ 59);
/* harmony import */ var _components_labor_rights_info_form_labor_rights_info_form_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/labor-rights-info-form/labor-rights-info-form.component */ 2609);
/* harmony import */ var _components_mutual_aid_community_engagement_form_mutual_aid_community_engagement_form_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/mutual-aid-community-engagement-form/mutual-aid-community-engagement-form.component */ 7797);
/* harmony import */ var _components_professional_info_form_professional_info_form_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/professional-info-form/professional-info-form.component */ 1923);
/* harmony import */ var _components_volunteer_preference_info_form_volunteer_preference_info_form_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/volunteer-preference-info-form/volunteer-preference-info-form.component */ 521);
var _EditPage;



















function EditPage_app_header_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](0, "app-header", 3);
  }
  if (rf & 2) {
    const account_r1 = ctx.ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("defaultHref", "account/" + account_r1.id)("title", account_r1.name);
  }
}
function EditPage_ion_grid_4_app_basic_info_form_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](0, "app-basic-info-form", 8);
  }
  if (rf & 2) {
    const account_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("account", account_r4);
  }
}
function EditPage_ion_grid_4_app_contact_info_form_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](0, "app-contact-info-form", 8);
  }
  if (rf & 2) {
    const account_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("account", account_r4);
  }
}
function EditPage_ion_grid_4_app_professional_info_form_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](0, "app-professional-info-form", 8);
  }
  if (rf & 2) {
    const account_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("account", account_r4);
  }
}
function EditPage_ion_grid_4_app_volunteer_preference_info_form_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](0, "app-volunteer-preference-info-form", 8);
  }
  if (rf & 2) {
    const account_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("account", account_r4);
  }
}
function EditPage_ion_grid_4_app_mutual_aid_community_engagement_form_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](0, "app-mutual-aid-community-engagement-form", 8);
  }
  if (rf & 2) {
    const account_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("account", account_r4);
  }
}
function EditPage_ion_grid_4_app_labor_rights_info_form_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](0, "app-labor-rights-info-form", 8);
  }
  if (rf & 2) {
    const account_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("account", account_r4);
  }
}
function EditPage_ion_grid_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "ion-grid")(1, "ion-row")(2, "ion-col", 4)(3, "app-edit-menu", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipe"](4, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("itemSelected", function EditPage_ion_grid_4_Template_app_edit_menu_itemSelected_3_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r2);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵresetView"](ctx_r2.onItemSelected($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](5, "ion-col", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](6, EditPage_ion_grid_4_app_basic_info_form_6_Template, 1, 1, "app-basic-info-form", 7)(7, EditPage_ion_grid_4_app_contact_info_form_7_Template, 1, 1, "app-contact-info-form", 7)(8, EditPage_ion_grid_4_app_professional_info_form_8_Template, 1, 1, "app-professional-info-form", 7)(9, EditPage_ion_grid_4_app_volunteer_preference_info_form_9_Template, 1, 1, "app-volunteer-preference-info-form", 7)(10, EditPage_ion_grid_4_app_mutual_aid_community_engagement_form_10_Template, 1, 1, "app-mutual-aid-community-engagement-form", 7)(11, EditPage_ion_grid_4_app_labor_rights_info_form_11_Template, 1, 1, "app-labor-rights-info-form", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    const account_r4 = ctx.ngIf;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("account", account_r4)("isProfileOwner", (tmp_3_0 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipeBind1"](4, 8, ctx_r2.isProfileOwner$)) !== null && tmp_3_0 !== undefined ? tmp_3_0 : false);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.selectedForm === "basic");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.selectedForm === "contact");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.selectedForm === "professional");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.selectedForm === "volunteer");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.selectedForm === "mutual aid");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.selectedForm === "labor");
  }
}
class EditPage {
  constructor(activatedRoute, metaService, router, store) {
    this.activatedRoute = activatedRoute;
    this.metaService = metaService;
    this.router = router;
    this.store = store;
    this.selectedForm = "basic";
  }
  ionViewWillEnter() {
    this.metaService.updateMetaTags("Account | ASCENDynamics NFP", "Manage your account details, preferences, and activities on ASCENDynamics NFP.", "account, profile, settings, volunteer", {
      title: "Account | ASCENDynamics NFP",
      description: "Access and manage your account details on ASCENDynamics NFP.",
      url: "https://app.ASCENDynamics.org/account",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    }, {
      card: "summary",
      title: "Account | ASCENDynamics NFP",
      description: "Update your account details and settings on ASCENDynamics NFP.",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    });
  }
  ngOnInit() {
    this.authUser$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAuthUser);
    const accountId$ = this.activatedRoute.paramMap.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.map)(params => params.get("accountId")), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_14__.filter)(accountId => accountId !== null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.tap)(accountId => {
      // Dispatch actions to load and select the account
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.loadAccount({
        accountId
      }));
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_16__.shareReplay)(1));
    this.account$ = accountId$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_17__.switchMap)(accountId => this.store.select((0,_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_0__.selectAccountById)(accountId))));
    // Check if the user is the profile owner
    (0,rxjs__WEBPACK_IMPORTED_MODULE_18__.combineLatest)([this.authUser$, this.account$]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_19__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.tap)(([authUser, account]) => {
      if (authUser && account && authUser.uid !== account.id) {
        // Redirect to unauthorized page if not the profile owner
        this.router.navigate(["/account/" + account.id]);
      }
    })).subscribe();
    // Observable to determine if the current user is the profile owner
    this.isProfileOwner$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_18__.combineLatest)([this.authUser$, this.account$]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.map)(([authUser, account]) => (authUser === null || authUser === void 0 ? void 0 : authUser.uid) === (account === null || account === void 0 ? void 0 : account.id)));
  }
  onItemSelected(form) {
    this.selectedForm = form;
  }
}
_EditPage = EditPage;
_EditPage.ɵfac = function EditPage_Factory(t) {
  return new (t || _EditPage)(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_20__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](_core_services_meta_service__WEBPACK_IMPORTED_MODULE_3__.MetaService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_20__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_21__.Store));
};
_EditPage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdefineComponent"]({
  type: _EditPage,
  selectors: [["app-edit"]],
  decls: 6,
  vars: 7,
  consts: [[3, "defaultHref", "title", 4, "ngIf"], [3, "fullscreen"], [4, "ngIf"], [3, "defaultHref", "title"], ["size", "12", "size-sm", "12", "size-md", "5"], [3, "itemSelected", "account", "isProfileOwner"], ["size", "12", "size-sm", "12", "size-md", "7"], [3, "account", 4, "ngIf"], [3, "account"]],
  template: function EditPage_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "ion-header");
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](1, EditPage_app_header_1_Template, 1, 2, "app-header", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipe"](2, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "ion-content", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](4, EditPage_ion_grid_4_Template, 12, 10, "ion-grid", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipe"](5, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipeBind1"](2, 3, ctx.account$));
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("fullscreen", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpipeBind1"](5, 5, ctx.account$));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_22__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_23__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_23__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_23__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_23__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_23__.IonRow, _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_4__.AppHeaderComponent, _components_edit_menu_edit_menu_component__WEBPACK_IMPORTED_MODULE_5__.EditMenuComponent, _components_basic_info_form_basic_info_form_component__WEBPACK_IMPORTED_MODULE_6__.BasicInfoFormComponent, _components_contact_info_form_contact_info_form_component__WEBPACK_IMPORTED_MODULE_7__.ContactInfoFormComponent, _components_labor_rights_info_form_labor_rights_info_form_component__WEBPACK_IMPORTED_MODULE_8__.LaborRightsInfoFormComponent, _components_mutual_aid_community_engagement_form_mutual_aid_community_engagement_form_component__WEBPACK_IMPORTED_MODULE_9__.MutualAidCommunityEngagementFormComponent, _components_professional_info_form_professional_info_form_component__WEBPACK_IMPORTED_MODULE_10__.ProfessionalInfoFormComponent, _components_volunteer_preference_info_form_volunteer_preference_info_form_component__WEBPACK_IMPORTED_MODULE_11__.VolunteerPreferenceInfoFormComponent, _angular_common__WEBPACK_IMPORTED_MODULE_22__.AsyncPipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2VkaXQvZWRpdC5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 1209:
/*!*********************************************************************!*\
  !*** ./src/app/modules/account/pages/group-list/group-list.page.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GroupListPage: () => (/* binding */ GroupListPage)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 3150);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 5536);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs */ 1640);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ 1856);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 5117);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs/operators */ 6816);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs/operators */ 3396);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs/operators */ 9746);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! rxjs/operators */ 1082);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs/operators */ 4406);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../state/selectors/account.selectors */ 8686);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../state/actions/account.actions */ 8314);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _core_services_meta_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../core/services/meta.service */ 6369);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/components/app-header/app-header.component */ 8245);
/* harmony import */ var _shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../shared/components/pagination/pagination.component */ 4815);
var _GroupListPage;













const _c0 = a0 => ["/account/", a0];
function GroupListPage_ng_container_6_ion_item_1_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](0, "img", 11);
  }
  if (rf & 2) {
    const item_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("alt", item_r2.name)("src", item_r2.iconImage, _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"]);
  }
}
function GroupListPage_ng_container_6_ion_item_1_ion_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function GroupListPage_ng_container_6_ion_item_1_ion_button_8_Template_ion_button_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r3);
      const item_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      $event.stopPropagation();
      $event.preventDefault();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r3.sendRequest(item_r2));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Send Request ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function GroupListPage_ng_container_6_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-item", 7)(1, "ion-thumbnail", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](2, GroupListPage_ng_container_6_ion_item_1_img_2_Template, 1, 2, "img", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "ion-label")(4, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](8, GroupListPage_ng_container_6_ion_item_1_ion_button_8_Template, 2, 0, "ion-button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](9, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction1"](7, _c0, item_r2.id));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", item_r2.iconImage);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](item_r2 == null ? null : item_r2.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](item_r2 == null ? null : item_r2.tagline);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](9, 5, ctx_r3.showRequestButton(item_r2)));
  }
}
function GroupListPage_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](1, GroupListPage_ng_container_6_ion_item_1_Template, 10, 9, "ion-item", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](2, 1, ctx_r3.paginatedAccounts$));
  }
}
function GroupListPage_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-item")(1, "ion-label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, " No groups found. Try a different search term. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
}
class GroupListPage {
  constructor(metaService, store) {
    this.metaService = metaService;
    this.store = store;
    this.searchTerms = new rxjs__WEBPACK_IMPORTED_MODULE_7__.Subject();
    this.searchedValue = "";
    // Pagination State
    this.pageSize = 10; // Number of groups per page
    this.currentPageSubject = new rxjs__WEBPACK_IMPORTED_MODULE_8__.BehaviorSubject(1);
    this.currentPage$ = this.currentPageSubject.asObservable();
    this.loading$ = this.store.select(_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAccountLoading);
  }
  ionViewWillEnter() {
    this.loadRelatedAccountsForAuthUser();
    this.metaService.updateMetaTags("Search NGOs | ASCENDynamics NFP", "Find opportunities, groups, and profiles tailored to your interests on ASCENDynamics NFP.", "search, opportunities, volunteer, nonprofits", {
      title: "Search NGOs | ASCENDynamics NFP",
      description: "Discover listings, profiles, and groups that match your search criteria.",
      url: "https://app.ASCENDynamics.org/search",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    }, {
      card: "summary_large_image",
      title: "Search Results",
      description: "Browse search results and find opportunities that match your interests.",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    });
  }
  loadRelatedAccountsForAuthUser() {
    this.authUser$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.filter)(authUser => authUser !== null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.take)(1)).subscribe(authUser => {
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.loadRelatedAccounts({
        accountId: authUser.uid
      }));
    });
  }
  ngOnInit() {
    this.authUser$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_0__.selectAuthUser);
    this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.loadAccounts());
    const filteredAccounts$ = this.searchTerms.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.startWith)(this.searchedValue), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.debounceTime)(300), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.distinctUntilChanged)(), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_14__.switchMap)(term => this.store.select((0,_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__.selectFilteredAccounts)(term, "group"))));
    // Total Items for Pagination
    this.totalItems$ = filteredAccounts$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.map)(accounts => accounts.length));
    // Total Pages
    this.totalPages$ = this.totalItems$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.map)(totalItems => Math.ceil(totalItems / this.pageSize)));
    // Paginated Results
    this.paginatedAccounts$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_16__.combineLatest)([filteredAccounts$, this.currentPage$]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.map)(([accounts, currentPage]) => {
      const startIndex = (currentPage - 1) * this.pageSize;
      return accounts.slice(startIndex, startIndex + this.pageSize);
    }));
  }
  search(event) {
    const value = event.target.value;
    this.searchTerms.next(value);
  }
  goToPage(pageNumber) {
    this.currentPageSubject.next(pageNumber);
  }
  sendRequest(account) {
    this.authUser$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.take)(1)).subscribe(authUser => {
      if (!(authUser !== null && authUser !== void 0 && authUser.uid) || !account.id) {
        console.error("User ID or Account ID is missing");
        return;
      }
      const newRelatedAccount = {
        id: account.id,
        accountId: authUser.uid,
        initiatorId: authUser.uid,
        targetId: account.id,
        type: account.type,
        status: "pending",
        relationship: "member",
        tagline: account.tagline,
        name: account.name,
        iconImage: account.iconImage,
        createdBy: authUser.uid,
        lastModifiedBy: authUser.uid
      };
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.createRelatedAccount({
        accountId: authUser.uid,
        relatedAccount: newRelatedAccount
      }));
    });
  }
  showRequestButton(item) {
    return this.authUser$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.filter)(authUser => authUser !== null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_14__.switchMap)(authUser => this.store.select((0,_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__.selectRelatedAccountsByAccountId)(authUser.uid)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.map)(relatedAccounts => ({
      authUser,
      relatedAccounts
    })))), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.map)(({
      authUser,
      relatedAccounts
    }) => {
      if (authUser.uid === item.id) {
        return false;
      }
      const shouldShowButton = !relatedAccounts.some(ra => (ra.initiatorId === item.id && ra.targetId === authUser.uid || ra.initiatorId === authUser.uid && ra.targetId === item.id) && ra.status !== "rejected");
      return shouldShowButton;
    }));
  }
}
_GroupListPage = GroupListPage;
_GroupListPage.ɵfac = function GroupListPage_Factory(t) {
  return new (t || _GroupListPage)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_core_services_meta_service__WEBPACK_IMPORTED_MODULE_3__.MetaService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_17__.Store));
};
_GroupListPage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
  type: _GroupListPage,
  selectors: [["app-group-list"]],
  decls: 12,
  vars: 12,
  consts: [["noResultsTemplate", ""], [3, "title"], [3, "ionInput", "debounce"], [3, "fullscreen"], [4, "ngIf", "ngIfElse"], [3, "pageChange", "totalItems", "pageSize", "maxVisiblePages"], ["button", "", 3, "routerLink", 4, "ngFor", "ngForOf"], ["button", "", 3, "routerLink"], ["slot", "start"], [3, "alt", "src", 4, "ngIf"], ["slot", "end", "mode", "md", "expand", "block", 3, "click", 4, "ngIf"], [3, "alt", "src"], ["slot", "end", "mode", "md", "expand", "block", 3, "click"], [1, "ion-text-center"]],
  template: function GroupListPage_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-header");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "app-header", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "ion-toolbar")(3, "ion-searchbar", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ionInput", function GroupListPage_Template_ion_searchbar_ionInput_3_listener($event) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r1);
        return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx.search($event));
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "ion-content", 3)(5, "ion-list");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](6, GroupListPage_ng_container_6_Template, 3, 3, "ng-container", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](7, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "app-pagination", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](9, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("pageChange", function GroupListPage_Template_app_pagination_pageChange_8_listener($event) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r1);
        return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx.goToPage($event));
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](10, GroupListPage_ng_template_10_Template, 3, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      let tmp_4_0;
      const noResultsTemplate_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵreference"](11);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("title", "Search Groups");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("debounce", 300);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("fullscreen", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", (tmp_4_0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](7, 8, ctx.paginatedAccounts$)) == null ? null : tmp_4_0.length)("ngIfElse", noResultsTemplate_r5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("totalItems", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](9, 10, ctx.totalItems$) || 0)("pageSize", ctx.pageSize)("maxVisiblePages", 5);
    }
  },
  dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_18__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_19__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_19__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_20__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_20__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_20__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_20__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_20__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_20__.IonList, _ionic_angular__WEBPACK_IMPORTED_MODULE_20__.IonSearchbar, _ionic_angular__WEBPACK_IMPORTED_MODULE_20__.IonThumbnail, _ionic_angular__WEBPACK_IMPORTED_MODULE_20__.IonToolbar, _ionic_angular__WEBPACK_IMPORTED_MODULE_20__.TextValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_20__.RouterLinkDelegate, _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_4__.AppHeaderComponent, _shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_5__.PaginationComponent, _angular_common__WEBPACK_IMPORTED_MODULE_19__.AsyncPipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL2dyb3VwLWxpc3QvZ3JvdXAtbGlzdC5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 5532:
/*!******************************************************************************************************************!*\
  !*** ./src/app/modules/account/pages/registration/components/group-registration/group-registration.component.ts ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GroupRegistrationComponent: () => (/* binding */ GroupRegistrationComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _core_data_phone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../core/data/phone */ 2985);
/* harmony import */ var _core_data_country__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../core/data/country */ 3095);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../state/actions/account.actions */ 8314);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _GroupRegistrationComponent;










const _c0 = () => ["basicInformation", "contactInformation"];
function GroupRegistrationComponent_ion_note_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " This field is required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function GroupRegistrationComponent_ion_note_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " This field is required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function GroupRegistrationComponent_ion_grid_39_ion_note_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid URL including http:// or https:// ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function GroupRegistrationComponent_ion_grid_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-grid", 28)(1, "ion-row")(2, "ion-col")(3, "ion-select", 29)(4, "ion-select-option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Social Media");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "ion-select-option", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7, "Donation");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "ion-select-option", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9, "Hobbies");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "ion-select-option", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11, "Publications");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "ion-select-option", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](13, "Portfolio");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "ion-select-option", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](15, "Personal Website");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "ion-select-option", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](17, "External Resources");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](18, "ion-select-option", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](19, "Other");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](21, "ion-input", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](23, "ion-input", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](24, GroupRegistrationComponent_ion_grid_39_ion_note_24_Template, 2, 0, "ion-note", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](25, "ion-col", 40)(26, "ion-button", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function GroupRegistrationComponent_ion_grid_39_Template_ion_button_click_26_listener() {
      const i_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1).index;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r2.removeWebLink(i_r2));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](27, "ion-icon", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const linkControl_r4 = ctx.$implicit;
    const i_r2 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroupName", i_r2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_4_0 = linkControl_r4.get("url")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = linkControl_r4.get("url")) == null ? null : tmp_4_0.touched));
  }
}
function GroupRegistrationComponent_div_55_ion_note_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid email ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function GroupRegistrationComponent_div_55_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 28)(1, "ion-grid")(2, "ion-row")(3, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "ion-input", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](6, "ion-input", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, GroupRegistrationComponent_div_55_ion_note_7_Template, 2, 0, "ion-note", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "ion-col", 40)(9, "ion-button", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function GroupRegistrationComponent_div_55_Template_ion_button_click_9_listener() {
      const i_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r5).index;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r2.removeEmail(i_r6));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](10, "ion-icon", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const emailControl_r7 = ctx.$implicit;
    const i_r6 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroupName", i_r6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_4_0 = emailControl_r7.get("email")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = emailControl_r7.get("email")) == null ? null : tmp_4_0.touched));
  }
}
function GroupRegistrationComponent_div_65_ion_select_option_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-select-option", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const code_r9 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", code_r9.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](code_r9.label);
  }
}
function GroupRegistrationComponent_div_65_ion_note_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid phone number ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function GroupRegistrationComponent_div_65_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 28)(1, "ion-grid")(2, "ion-row")(3, "ion-col", 45)(4, "ion-select", 46)(5, "ion-select-option", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "Mobile");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "ion-select-option", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8, "Home");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "ion-select-option", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](10, "Work");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "ion-col", 45)(12, "ion-select", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](13, GroupRegistrationComponent_div_65_ion_select_option_13_Template, 2, 2, "ion-select-option", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "ion-col", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](15, "ion-input", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](16, GroupRegistrationComponent_div_65_ion_note_16_Template, 2, 0, "ion-note", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "ion-col")(18, "ion-item", 54)(19, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](20, "Emergency Contact");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](21, "ion-checkbox", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "ion-col", 40)(23, "ion-button", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function GroupRegistrationComponent_div_65_Template_ion_button_click_23_listener() {
      const i_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r8).index;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r2.removePhoneNumber(i_r10));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](24, "ion-icon", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    let tmp_5_0;
    const phoneControl_r11 = ctx.$implicit;
    const i_r10 = ctx.index;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroupName", i_r10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r2.countryCodes);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_5_0 = phoneControl_r11.get("number")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = phoneControl_r11.get("number")) == null ? null : tmp_5_0.touched));
  }
}
function GroupRegistrationComponent_div_75_ion_note_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid address ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function GroupRegistrationComponent_div_75_ion_note_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid city name ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function GroupRegistrationComponent_div_75_ion_select_option_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-select-option", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const code_r13 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", code_r13.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](code_r13.label);
  }
}
function GroupRegistrationComponent_div_75_ion_select_option_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-select-option", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const code_r14 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", code_r14.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](code_r14.label);
  }
}
function GroupRegistrationComponent_div_75_ion_note_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid zip code ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function GroupRegistrationComponent_div_75_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 28)(1, "ion-row")(2, "ion-col")(3, "ion-row")(4, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](5, "ion-input", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "ion-row")(7, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](8, "ion-input", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](9, GroupRegistrationComponent_div_75_ion_note_9_Template, 2, 0, "ion-note", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "ion-row")(11, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](12, "ion-input", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](13, GroupRegistrationComponent_div_75_ion_note_13_Template, 2, 0, "ion-note", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "ion-col")(15, "ion-row")(16, "ion-col")(17, "ion-select", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](18, GroupRegistrationComponent_div_75_ion_select_option_18_Template, 2, 2, "ion-select-option", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](19, "ion-row")(20, "ion-col")(21, "ion-select", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](22, GroupRegistrationComponent_div_75_ion_select_option_22_Template, 2, 2, "ion-select-option", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](23, "ion-row")(24, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](25, "ion-input", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](26, GroupRegistrationComponent_div_75_ion_note_26_Template, 2, 0, "ion-note", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](27, "ion-row")(28, "ion-col")(29, "ion-item", 54)(30, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](31, "Primary Address");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](32, "ion-checkbox", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](33, "ion-col", 40)(34, "ion-button", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function GroupRegistrationComponent_div_75_Template_ion_button_click_34_listener() {
      const i_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r12).index;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r2.removeAddress(i_r15));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](35, "ion-icon", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    let tmp_8_0;
    const i_r15 = ctx.index;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroupName", i_r15);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_4_0 = ctx_r2.editAccountForm.get("contactInformation.addresses." + i_r15 + ".street")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx_r2.editAccountForm.get("contactInformation.addresses." + i_r15 + ".street")) == null ? null : tmp_4_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_5_0 = ctx_r2.editAccountForm.get("contactInformation.addresses." + i_r15 + ".city")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx_r2.editAccountForm.get("contactInformation.addresses." + i_r15 + ".city")) == null ? null : tmp_5_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r2.countries);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r2.statesProvinces);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_8_0 = ctx_r2.editAccountForm.get("contactInformation.addresses." + i_r15 + ".zipcode")) == null ? null : tmp_8_0.invalid) && ((tmp_8_0 = ctx_r2.editAccountForm.get("contactInformation.addresses." + i_r15 + ".zipcode")) == null ? null : tmp_8_0.touched));
  }
}
class GroupRegistrationComponent {
  constructor(fb, router, store) {
    this.fb = fb;
    this.router = router;
    this.store = store;
    this.redirectSubmit = false;
    this.maxAddresses = 3; // Set maximum number of addresses
    this.maxEmails = 5;
    this.maxLinks = 10;
    this.maxPhoneNumbers = 5;
    this.countries = _core_data_country__WEBPACK_IMPORTED_MODULE_1__.countries; // List of countries for the address
    this.countryCodes = _core_data_phone__WEBPACK_IMPORTED_MODULE_0__.countryCodes.sort((a, b) => Number(a.value) > Number(b.value) ? 1 : -1); // List of country codes for phone numbers
    this.statesProvinces = _core_data_country__WEBPACK_IMPORTED_MODULE_1__.statesProvinces; // List of states/provinces for the selected country
    // Initialize the form in ngOnInit after fb is initialized
    this.editAccountForm = this.fb.group({
      description: [""],
      tagline: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required],
      name: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required],
      webLinks: this.fb.array([this.createWebLinkFormGroup()]),
      contactInformation: this.fb.group({
        emails: this.fb.array([this.createEmailFormGroup()]),
        phoneNumbers: this.fb.array([this.createPhoneNumberFormGroup()]),
        addresses: this.fb.array([this.createAddressFormGroup()]),
        preferredMethodOfContact: ["Email"]
      }),
      groupDetails: this.fb.group({
        groupType: []
      })
    });
  }
  ngOnChanges(changes) {
    if (changes["account"] && this.account) {
      this.loadFormData();
    }
  }
  get addressesFormArray() {
    return this.editAccountForm.get("contactInformation.addresses");
  }
  get phoneNumbersFormArray() {
    return this.editAccountForm.get("contactInformation.phoneNumbers");
  }
  get emailsFormArray() {
    return this.editAccountForm.get("contactInformation.emails");
  }
  /**
   * Returns the FormArray for the webLinks control in the editAccountForm.
   * @returns {FormArray} The FormArray for the webLinks control.
   */
  get webLinksFormArray() {
    return this.editAccountForm.get("webLinks");
  }
  onSubmit() {
    if (this.account) {
      var _formValue$webLinks, _formValue$groupDetai, _formValue$contactInf, _formValue$contactInf2, _formValue$contactInf3, _formValue$contactInf4, _formValue$contactInf5, _formValue$contactInf6;
      const formValue = this.editAccountForm.value;
      const updatedAccount = {
        ...this.account,
        ...formValue,
        type: "group",
        name: formValue.name,
        tagline: formValue.tagline,
        description: formValue.description || "",
        webLinks: ((_formValue$webLinks = formValue.webLinks) === null || _formValue$webLinks === void 0 ? void 0 : _formValue$webLinks.map(link => ({
          name: link.name,
          url: link.url,
          category: link.category || ""
        }))) || [],
        groupDetails: {
          ...this.account.groupDetails,
          ...formValue.groupDetails,
          groupType: ((_formValue$groupDetai = formValue.groupDetails) === null || _formValue$groupDetai === void 0 ? void 0 : _formValue$groupDetai.groupType) || "Nonprofit"
        },
        contactInformation: {
          ...this.account.contactInformation,
          ...formValue.contactInformation,
          emails: (_formValue$contactInf = (_formValue$contactInf2 = formValue.contactInformation.emails) === null || _formValue$contactInf2 === void 0 ? void 0 : _formValue$contactInf2.map(email => {
            var _email$name;
            return {
              name: (_email$name = email.name) !== null && _email$name !== void 0 ? _email$name : null,
              email: email.email
            };
          })) !== null && _formValue$contactInf !== void 0 ? _formValue$contactInf : [],
          phoneNumbers: (_formValue$contactInf3 = (_formValue$contactInf4 = formValue.contactInformation.phoneNumbers) === null || _formValue$contactInf4 === void 0 ? void 0 : _formValue$contactInf4.map(phone => {
            var _phone$countryCode, _phone$number, _phone$type;
            return {
              countryCode: (_phone$countryCode = phone.countryCode) !== null && _phone$countryCode !== void 0 ? _phone$countryCode : null,
              number: (_phone$number = phone.number) !== null && _phone$number !== void 0 ? _phone$number : null,
              type: (_phone$type = phone.type) !== null && _phone$type !== void 0 ? _phone$type : null,
              isEmergencyNumber: phone.isEmergencyNumber || false
            };
          })) !== null && _formValue$contactInf3 !== void 0 ? _formValue$contactInf3 : [{
            countryCode: null,
            number: null,
            type: null,
            isEmergencyNumber: false
          }],
          addresses: (_formValue$contactInf5 = (_formValue$contactInf6 = formValue.contactInformation.addresses) === null || _formValue$contactInf6 === void 0 ? void 0 : _formValue$contactInf6.map(address => {
            var _address$name, _address$street, _address$city, _address$state, _address$zipcode, _address$country;
            return {
              name: (_address$name = address === null || address === void 0 ? void 0 : address.name) !== null && _address$name !== void 0 ? _address$name : null,
              street: (_address$street = address === null || address === void 0 ? void 0 : address.street) !== null && _address$street !== void 0 ? _address$street : null,
              city: (_address$city = address === null || address === void 0 ? void 0 : address.city) !== null && _address$city !== void 0 ? _address$city : null,
              state: (_address$state = address === null || address === void 0 ? void 0 : address.state) !== null && _address$state !== void 0 ? _address$state : null,
              zipcode: (_address$zipcode = address === null || address === void 0 ? void 0 : address.zipcode) !== null && _address$zipcode !== void 0 ? _address$zipcode : null,
              country: (_address$country = address === null || address === void 0 ? void 0 : address.country) !== null && _address$country !== void 0 ? _address$country : null
            };
          })) !== null && _formValue$contactInf5 !== void 0 ? _formValue$contactInf5 : [],
          preferredMethodOfContact: "Email"
        }
      };
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.updateAccount({
        account: updatedAccount
      }));
      if (this.redirectSubmit) {
        this.router.navigateByUrl(`/account/${this.account.id}/details`);
      }
    }
  }
  loadFormData() {
    var _this$account$webLink, _this$account$contact, _this$account$contact2, _this$account$contact3, _this$account$contact4, _this$account$contact5, _this$account$contact6;
    if (!this.account) return;
    // Reset form arrays
    while (this.webLinksFormArray.length !== 0) {
      this.webLinksFormArray.removeAt(0);
    }
    while (this.emailsFormArray.length !== 0) {
      this.emailsFormArray.removeAt(0);
    }
    while (this.phoneNumbersFormArray.length !== 0) {
      this.phoneNumbersFormArray.removeAt(0);
    }
    while (this.addressesFormArray.length !== 0) {
      this.addressesFormArray.removeAt(0);
    }
    // Load data from account into form arrays and form controls
    (_this$account$webLink = this.account.webLinks) === null || _this$account$webLink === void 0 || _this$account$webLink.forEach(webLink => {
      this.webLinksFormArray.push(this.fb.group({
        name: [webLink.name],
        url: [webLink.url, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern(/^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/?].*)?$/)]],
        category: [webLink.category]
      }));
    });
    if (this.webLinksFormArray.length === 0) {
      this.addWebLink();
    }
    (_this$account$contact = this.account.contactInformation) === null || _this$account$contact === void 0 || (_this$account$contact = _this$account$contact.emails) === null || _this$account$contact === void 0 || _this$account$contact.forEach(email => {
      this.emailsFormArray.push(this.fb.group({
        name: [email.name],
        email: [email.email, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.email]
      }));
    });
    if (this.emailsFormArray.length === 0) {
      this.addEmail();
    }
    (_this$account$contact2 = this.account.contactInformation) === null || _this$account$contact2 === void 0 || (_this$account$contact2 = _this$account$contact2.phoneNumbers) === null || _this$account$contact2 === void 0 || _this$account$contact2.forEach(phone => {
      this.phoneNumbersFormArray.push(this.fb.group({
        countryCode: [phone.countryCode],
        number: [phone.number, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^\\d{10}$")]],
        type: [phone.type],
        isEmergencyNumber: [phone.isEmergencyNumber]
      }));
    });
    if (this.phoneNumbersFormArray.length === 0) {
      this.addPhoneNumber();
    }
    (_this$account$contact3 = this.account.contactInformation) === null || _this$account$contact3 === void 0 || (_this$account$contact3 = _this$account$contact3.addresses) === null || _this$account$contact3 === void 0 || _this$account$contact3.forEach(address => {
      this.addressesFormArray.push(this.fb.group({
        name: [address === null || address === void 0 ? void 0 : address.name],
        street: [address === null || address === void 0 ? void 0 : address.street, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[a-zA-Z0-9\\s,]*$")],
        city: [address === null || address === void 0 ? void 0 : address.city, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[a-zA-Z\\s]*$")],
        state: [address === null || address === void 0 ? void 0 : address.state],
        zipcode: [address === null || address === void 0 ? void 0 : address.zipcode, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[0-9]*$")],
        country: [address === null || address === void 0 ? void 0 : address.country]
      }));
    });
    if (this.addressesFormArray.length === 0) {
      this.addAddress();
    }
    this.editAccountForm.patchValue({
      name: this.account.name,
      description: this.account.description,
      tagline: this.account.tagline,
      contactInformation: {
        emails: ((_this$account$contact4 = this.account.contactInformation) === null || _this$account$contact4 === void 0 || (_this$account$contact4 = _this$account$contact4.emails) === null || _this$account$contact4 === void 0 ? void 0 : _this$account$contact4.map(email => ({
          name: email.name,
          email: email.email
        }))) || [this.createEmailFormGroup()],
        phoneNumbers: ((_this$account$contact5 = this.account.contactInformation) === null || _this$account$contact5 === void 0 || (_this$account$contact5 = _this$account$contact5.phoneNumbers) === null || _this$account$contact5 === void 0 ? void 0 : _this$account$contact5.map(phone => ({
          countryCode: phone.countryCode,
          number: phone.number,
          type: phone.type,
          isEmergencyNumber: phone.isEmergencyNumber
        }))) || [this.createPhoneNumberFormGroup()],
        addresses: ((_this$account$contact6 = this.account.contactInformation) === null || _this$account$contact6 === void 0 ? void 0 : _this$account$contact6.addresses) || [this.createAddressFormGroup()]
      }
    });
  }
  /**
   * Adds a new email form group to the emails form array, up to a max of maxEmails.
   * This allows an additional email input to be displayed in the form.
   */
  addEmail() {
    if (this.emailsFormArray.length < this.maxEmails) {
      this.emailsFormArray.push(this.createEmailFormGroup());
    }
  }
  removeEmail(index) {
    this.emailsFormArray.removeAt(index);
  }
  createEmailFormGroup() {
    return this.fb.group({
      name: [""],
      email: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.email]]
    });
  }
  createPhoneNumberFormGroup() {
    return this.fb.group({
      countryCode: [""],
      number: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^\\d{10}$")]],
      type: [""],
      isEmergencyNumber: [false]
    });
  }
  addPhoneNumber() {
    if (this.phoneNumbersFormArray.length < this.maxPhoneNumbers) {
      this.phoneNumbersFormArray.push(this.createPhoneNumberFormGroup());
    }
  }
  removePhoneNumber(index) {
    this.phoneNumbersFormArray.removeAt(index);
  }
  createWebLinkFormGroup() {
    return this.fb.group({
      name: ["", []],
      url: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern(/^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/?].*)?$/)]],
      category: [""]
    });
  }
  addWebLink() {
    if (this.webLinksFormArray.length < this.maxLinks) {
      this.webLinksFormArray.push(this.createWebLinkFormGroup());
    }
  }
  removeWebLink(index) {
    // Remove the link at the given index
    this.webLinksFormArray.removeAt(index);
  }
  createAddressFormGroup() {
    return this.fb.group({
      name: [""],
      street: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[a-zA-Z0-9\\s,]*$")],
      city: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[a-zA-Z\\s]*$")],
      state: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[a-zA-Z\\s]*$")],
      zipcode: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[0-9]*$")],
      country: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[a-zA-Z\\s]*$")],
      isPrimaryAddress: [false]
    });
  }
  addAddress() {
    this.addressesFormArray.push(this.createAddressFormGroup());
  }
  removeAddress(index) {
    this.addressesFormArray.removeAt(index);
  }
}
_GroupRegistrationComponent = GroupRegistrationComponent;
_GroupRegistrationComponent.ɵfac = function GroupRegistrationComponent_Factory(t) {
  return new (t || _GroupRegistrationComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_6__.Store));
};
_GroupRegistrationComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
  type: _GroupRegistrationComponent,
  selectors: [["app-group-registration"]],
  inputs: {
    account: "account",
    redirectSubmit: "redirectSubmit"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵNgOnChangesFeature"]],
  decls: 83,
  vars: 16,
  consts: [[3, "ngSubmit", "formGroup"], [3, "multiple", "value"], ["value", "basicInformation", "toggleIcon", "caret-down-circle", "toggleIconSlot", "start"], ["slot", "header", "color", "primary"], ["slot", "content"], ["label", "Group Name", "label-placement", "floating", "fill", "outline", "type", "text", "inputmode", "text", "formControlName", "name", "minlength", "1", "maxlength", "255", "placeholder", "Enter Name"], ["color", "danger", 4, "ngIf"], ["formControlName", "tagline", "minlength", "1", "maxlength", "255", "label", "Tagline", "label-placement", "floating", "fill", "outline", "placeholder", "Enter Tagline"], ["formGroupName", "groupDetails"], ["label", "Group Type", "label-placement", "stacked", "formControlName", "groupType", "interface", "popover", "placeholder", "Select One", "fill", "outline"], ["value", "Nonprofit"], ["value", "Community"], ["value", "Business"], ["value", "Government"], ["value", "Other"], ["label", "Description", "label-placement", "floating", "fill", "outline", "placeholder", "Enter Description", "formControlName", "description", "rows", "8", "minlength", "0", "maxlength", "1000", 3, "counter"], ["color", "tertiary"], ["formArrayName", "webLinks"], [3, "formGroupName", 4, "ngFor", "ngForOf"], ["fill", "clear", 3, "click", "disabled"], ["slot", "start", "name", "add-circle-outline"], ["value", "contactInformation", "toggleIcon", "caret-down-circle", "toggleIconSlot", "start"], ["formArrayName", "contactInformation"], ["formArrayName", "emails"], ["formArrayName", "phoneNumbers"], ["formArrayName", "addresses"], ["expand", "block", "type", "submit", 3, "disabled"], ["color", "danger"], [3, "formGroupName"], ["label", "Category", "label-placement", "stacked", "fill", "outline", "formControlName", "category", "interface", "popover", "placeholder", "Select One"], ["value", "Social Media"], ["value", "Donation"], ["value", "Hobbies"], ["value", "Publications"], ["value", "Portfolio"], ["value", "Personal Website"], ["value", "External Resources"], ["label", "Name", "label-placement", "floating", "fill", "outline", "formControlName", "name", "type", "text"], ["label", "URL", "label-placement", "floating", "fill", "outline", "formControlName", "url", "type", "text", "minlength", "0", "maxlength", "100"], [4, "ngIf"], ["size", "1"], ["fill", "clear", 3, "click"], ["slot", "icon-only", "name", "trash-outline", 1, "remove-icon"], ["label", "Name", "label-placement", "floating", "fill", "outline", "formControlName", "name", "type", "text", "minlength", "0", "maxlength", "50"], ["label", "Email", "label-placement", "floating", "fill", "outline", "formControlName", "email", "type", "email", "minlength", "0", "maxlength", "50"], ["size", "2"], ["label", "Type", "label-placement", "stacked", "fill", "outline", "formControlName", "type", "interface", "popover", "placeholder", "Select One"], ["value", "Mobile"], ["value", "Home"], ["value", "Work"], ["formControlName", "countryCode", "label", "Country Code", "label-placement", "stacked", "placeholder", "Select One", "fill", "outline", "interface", "popover"], [3, "value", 4, "ngFor", "ngForOf"], ["size", "4"], ["label", "Number", "label-placement", "floating", "fill", "outline", "formControlName", "number", "type", "tel", "minlength", "0", "maxlength", "10"], ["lines", "none"], ["slot", "start", "formControlName", "isEmergencyNumber"], [3, "value"], ["label", "Address Name", "label-placement", "floating", "fill", "outline", "formControlName", "name", "type", "text", "minlength", "0", "maxlength", "50"], ["label", "Street Address", "label-placement", "floating", "fill", "outline", "formControlName", "street", "type", "text", "minlength", "0", "maxlength", "50"], ["label", "City", "label-placement", "floating", "fill", "outline", "formControlName", "city", "type", "text", "minlength", "0", "maxlength", "50"], ["formControlName", "country", "label", "Country", "label-placement", "stacked", "placeholder", "Select Country", "fill", "outline", "interface", "popover"], ["formControlName", "state", "label", "State", "label-placement", "stacked", "placeholder", "Select State", "fill", "outline", "interface", "popover"], ["label", "Zip/Postal Code", "label-placement", "floating", "fill", "outline", "formControlName", "zipcode", "type", "text", "minlength", "0", "maxlength", "5"], ["slot", "start", "formControlName", "isPrimaryAddress"]],
  template: function GroupRegistrationComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "form", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngSubmit", function GroupRegistrationComponent_Template_form_ngSubmit_0_listener() {
        return ctx.onSubmit();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "ion-accordion-group", 1)(2, "ion-accordion", 2)(3, "ion-item", 3)(4, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Basic Information");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "div", 4)(7, "ion-grid")(8, "ion-row")(9, "ion-col")(10, "ion-row")(11, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](12, "ion-input", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](13, GroupRegistrationComponent_ion_note_13_Template, 2, 0, "ion-note", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "ion-row")(15, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](16, "ion-input", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](17, GroupRegistrationComponent_ion_note_17_Template, 2, 0, "ion-note", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](18, "ion-row", 8)(19, "ion-col")(20, "ion-select", 9)(21, "ion-select-option", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](22, "Nonprofit");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](23, "ion-select-option", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](24, "Community");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](25, "ion-select-option", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](26, "Business");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](27, "ion-select-option", 13);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](28, "Government");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](29, "ion-select-option", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](30, "Other");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](31, "ion-col")(32, "ion-row")(33, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](34, "ion-textarea", 15);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](35, "ion-item-divider")(36, "ion-label", 16);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](37, "Web Links");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](38, "div", 17);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](39, GroupRegistrationComponent_ion_grid_39_Template, 28, 2, "ion-grid", 18);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](40, "ion-button", 19);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function GroupRegistrationComponent_Template_ion_button_click_40_listener() {
        return ctx.addWebLink();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](41, "ion-icon", 20);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](42, " Add Link ");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](43, "ion-accordion", 21)(44, "ion-item", 3)(45, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](46, "Contact Information");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](47, "div", 4)(48, "ion-grid", 22)(49, "ion-row")(50, "ion-col")(51, "ion-item-divider")(52, "ion-label", 16);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](53, "Emails");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](54, "div", 23);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](55, GroupRegistrationComponent_div_55_Template, 11, 2, "div", 18);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](56, "ion-button", 19);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function GroupRegistrationComponent_Template_ion_button_click_56_listener() {
        return ctx.addEmail();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](57, "ion-icon", 20);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](58, " Add Email ");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](59, "ion-row")(60, "ion-col")(61, "ion-item-divider")(62, "ion-label", 16);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](63, "Phone Numbers");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](64, "div", 24);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](65, GroupRegistrationComponent_div_65_Template, 25, 3, "div", 18);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](66, "ion-button", 19);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function GroupRegistrationComponent_Template_ion_button_click_66_listener() {
        return ctx.addPhoneNumber();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](67, "ion-icon", 20);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](68, " Add Phone Number ");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](69, "ion-row")(70, "ion-col")(71, "ion-item-divider")(72, "ion-label", 16);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](73, "Addresses");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](74, "div", 25);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](75, GroupRegistrationComponent_div_75_Template, 36, 6, "div", 18);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](76, "ion-button", 19);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function GroupRegistrationComponent_Template_ion_button_click_76_listener() {
        return ctx.addAddress();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](77, "ion-icon", 20);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](78, " Add Address ");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](79, "ion-row")(80, "ion-col")(81, "ion-button", 26);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](82, "Save and Continue");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
    }
    if (rf & 2) {
      let tmp_3_0;
      let tmp_4_0;
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroup", ctx.editAccountForm);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("multiple", true)("value", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction0"](15, _c0));
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](12);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_3_0 = ctx.editAccountForm.get("name")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx.editAccountForm.get("name")) == null ? null : tmp_3_0.touched));
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_4_0 = ctx.editAccountForm.get("tagline")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx.editAccountForm.get("tagline")) == null ? null : tmp_4_0.touched));
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](17);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("counter", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.webLinksFormArray.controls);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.webLinksFormArray.controls.length >= ctx.maxLinks);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](15);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.emailsFormArray.controls);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.emailsFormArray.controls.length >= ctx.maxEmails);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](9);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.phoneNumbersFormArray.controls);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.phoneNumbersFormArray.controls.length >= ctx.maxPhoneNumbers);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](9);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.addressesFormArray.controls);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.addressesFormArray.controls.length >= ctx.maxAddresses);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", !ctx.editAccountForm.valid);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.MaxLengthValidator, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonAccordion, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonAccordionGroup, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonCheckbox, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonInput, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonItemDivider, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonNote, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonSelect, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonSelectOption, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonTextarea, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.BooleanValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.SelectValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.TextValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormGroupName, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormArrayName],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.remove-icon[_ngcontent-%COMP%] {\n  font-size: 1.5em;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL3JlZ2lzdHJhdGlvbi9jb21wb25lbnRzL2dyb3VwLXJlZ2lzdHJhdGlvbi9ncm91cC1yZWdpc3RyYXRpb24uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQTtBQW1CQTtFQUNFLGdCQUFBO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtOiBBbGxvd2luZyBVc2VycyBhbmQgT3JnYW5pemF0aW9ucyB0byBDb2xsYWJvcmF0ZS5cbiogQ29weXJpZ2h0IChDKSAyMDIzICBBU0NFTkR5bmFtaWNzIE5GUFxuKlxuKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uXG4qXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4qIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZFxuKiBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4qIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4qIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuKiBhbG9uZyB3aXRoIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi5yZW1vdmUtaWNvbiB7XG4gIGZvbnQtc2l6ZTogMS41ZW07XG4gIC8vIGNvbG9yOiB2YXIoLS1pb24tY29sb3ItZGFuZ2VyKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ }),

/***/ 4460:
/*!****************************************************************************************************************!*\
  !*** ./src/app/modules/account/pages/registration/components/user-registration/user-registration.component.ts ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserRegistrationComponent: () => (/* binding */ UserRegistrationComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _core_data_phone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../core/data/phone */ 2985);
/* harmony import */ var _core_data_country__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../core/data/country */ 3095);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../state/actions/account.actions */ 8314);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _UserRegistrationComponent;










const _c0 = () => ["basicInformation", "contactInformation"];
function UserRegistrationComponent_ion_note_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " This field is required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UserRegistrationComponent_ion_note_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " This field is required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UserRegistrationComponent_ion_grid_26_ion_note_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid URL including http:// or https:// ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UserRegistrationComponent_ion_grid_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-grid", 21)(1, "ion-row")(2, "ion-col")(3, "ion-select", 22)(4, "ion-select-option", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Social Media");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "ion-select-option", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7, "Donation");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "ion-select-option", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9, "Hobbies");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "ion-select-option", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11, "Publications");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "ion-select-option", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](13, "Portfolio");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "ion-select-option", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](15, "Personal Website");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "ion-select-option", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](17, "External Resources");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](18, "ion-select-option", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](19, "Other");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](21, "ion-input", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](23, "ion-input", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](24, UserRegistrationComponent_ion_grid_26_ion_note_24_Template, 2, 0, "ion-note", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](25, "ion-col", 34)(26, "ion-button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UserRegistrationComponent_ion_grid_26_Template_ion_button_click_26_listener() {
      const i_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1).index;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r2.removeWebLink(i_r2));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](27, "ion-icon", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const linkControl_r4 = ctx.$implicit;
    const i_r2 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroupName", i_r2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_4_0 = linkControl_r4.get("url")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = linkControl_r4.get("url")) == null ? null : tmp_4_0.touched));
  }
}
function UserRegistrationComponent_div_42_ion_note_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid email ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UserRegistrationComponent_div_42_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 21)(1, "ion-grid")(2, "ion-row")(3, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "ion-input", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](6, "ion-input", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, UserRegistrationComponent_div_42_ion_note_7_Template, 2, 0, "ion-note", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "ion-col", 34)(9, "ion-button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UserRegistrationComponent_div_42_Template_ion_button_click_9_listener() {
      const i_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r5).index;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r2.removeEmail(i_r6));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](10, "ion-icon", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const emailControl_r7 = ctx.$implicit;
    const i_r6 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroupName", i_r6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_4_0 = emailControl_r7.get("email")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = emailControl_r7.get("email")) == null ? null : tmp_4_0.touched));
  }
}
function UserRegistrationComponent_div_52_ion_select_option_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-select-option", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const code_r9 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", code_r9.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](code_r9.label);
  }
}
function UserRegistrationComponent_div_52_ion_note_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid phone number ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UserRegistrationComponent_div_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 21)(1, "ion-grid")(2, "ion-row")(3, "ion-col", 39)(4, "ion-select", 40)(5, "ion-select-option", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "Mobile");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "ion-select-option", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8, "Home");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "ion-select-option", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](10, "Work");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "ion-col", 39)(12, "ion-select", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](13, UserRegistrationComponent_div_52_ion_select_option_13_Template, 2, 2, "ion-select-option", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "ion-col", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](15, "ion-input", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](16, UserRegistrationComponent_div_52_ion_note_16_Template, 2, 0, "ion-note", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "ion-col")(18, "ion-item", 48)(19, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](20, "Emergency Contact");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](21, "ion-checkbox", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "ion-col", 34)(23, "ion-button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UserRegistrationComponent_div_52_Template_ion_button_click_23_listener() {
      const i_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r8).index;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r2.removePhoneNumber(i_r10));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](24, "ion-icon", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    let tmp_5_0;
    const phoneControl_r11 = ctx.$implicit;
    const i_r10 = ctx.index;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroupName", i_r10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r2.countryCodes);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_5_0 = phoneControl_r11.get("number")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = phoneControl_r11.get("number")) == null ? null : tmp_5_0.touched));
  }
}
function UserRegistrationComponent_div_62_ion_note_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid address ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UserRegistrationComponent_div_62_ion_note_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid city name ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UserRegistrationComponent_div_62_ion_select_option_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-select-option", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const code_r13 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", code_r13.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](code_r13.label);
  }
}
function UserRegistrationComponent_div_62_ion_select_option_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-select-option", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const code_r14 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", code_r14.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](code_r14.label);
  }
}
function UserRegistrationComponent_div_62_ion_note_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Please enter a valid zip code ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UserRegistrationComponent_div_62_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 21)(1, "ion-row")(2, "ion-col")(3, "ion-row")(4, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](5, "ion-input", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "ion-row")(7, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](8, "ion-input", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](9, UserRegistrationComponent_div_62_ion_note_9_Template, 2, 0, "ion-note", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "ion-row")(11, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](12, "ion-input", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](13, UserRegistrationComponent_div_62_ion_note_13_Template, 2, 0, "ion-note", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "ion-col")(15, "ion-row")(16, "ion-col")(17, "ion-select", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](18, UserRegistrationComponent_div_62_ion_select_option_18_Template, 2, 2, "ion-select-option", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](19, "ion-row")(20, "ion-col")(21, "ion-select", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](22, UserRegistrationComponent_div_62_ion_select_option_22_Template, 2, 2, "ion-select-option", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](23, "ion-row")(24, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](25, "ion-input", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](26, UserRegistrationComponent_div_62_ion_note_26_Template, 2, 0, "ion-note", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](27, "ion-row")(28, "ion-col")(29, "ion-item", 48)(30, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](31, "Primary Address");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](32, "ion-checkbox", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](33, "ion-col", 34)(34, "ion-button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UserRegistrationComponent_div_62_Template_ion_button_click_34_listener() {
      const i_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r12).index;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r2.removeAddress(i_r15));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](35, "ion-icon", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    let tmp_8_0;
    const i_r15 = ctx.index;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroupName", i_r15);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_4_0 = ctx_r2.registrationForm.get("contactInformation.addresses." + i_r15 + ".street")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx_r2.registrationForm.get("contactInformation.addresses." + i_r15 + ".street")) == null ? null : tmp_4_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_5_0 = ctx_r2.registrationForm.get("contactInformation.addresses." + i_r15 + ".city")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx_r2.registrationForm.get("contactInformation.addresses." + i_r15 + ".city")) == null ? null : tmp_5_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r2.countries);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r2.statesProvinces);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_8_0 = ctx_r2.registrationForm.get("contactInformation.addresses." + i_r15 + ".zipcode")) == null ? null : tmp_8_0.invalid) && ((tmp_8_0 = ctx_r2.registrationForm.get("contactInformation.addresses." + i_r15 + ".zipcode")) == null ? null : tmp_8_0.touched));
  }
}
class UserRegistrationComponent {
  constructor(fb, store, router) {
    this.fb = fb;
    this.store = store;
    this.router = router;
    this.redirectSubmit = false;
    this.maxAddresses = 3; // Set maximum number of addresses
    this.maxEmails = 5;
    this.maxLinks = 10;
    this.maxPhoneNumbers = 5;
    this.countries = _core_data_country__WEBPACK_IMPORTED_MODULE_1__.countries; // List of countries for the address
    this.countryCodes = _core_data_phone__WEBPACK_IMPORTED_MODULE_0__.countryCodes.sort((a, b) => Number(a.value) > Number(b.value) ? 1 : -1); // List of country codes for phone numbers
    this.statesProvinces = _core_data_country__WEBPACK_IMPORTED_MODULE_1__.statesProvinces; // List of states/provinces for the selected country
    this.registrationForm = this.fb.group({
      description: [""],
      tagline: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required],
      name: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required],
      webLinks: this.fb.array([this.createWebLinkFormGroup()]),
      contactInformation: this.fb.group({
        emails: this.fb.array([this.createEmailFormGroup()]),
        phoneNumbers: this.fb.array([this.createPhoneNumberFormGroup()]),
        addresses: this.fb.array([this.createAddressFormGroup()]),
        preferredMethodOfContact: ["Email"]
      })
    });
  }
  ngOnChanges(changes) {
    if (changes["account"]) {
      this.loadFormData();
    }
  }
  get addressesFormArray() {
    return this.registrationForm.get("contactInformation.addresses");
  }
  get phoneNumbersFormArray() {
    return this.registrationForm.get("contactInformation.phoneNumbers");
  }
  get emailsFormArray() {
    return this.registrationForm.get("contactInformation.emails");
  }
  /**
   * Returns the FormArray for the webLinks control in the editAccountForm.
   * @returns {FormArray} The FormArray for the webLinks control.
   */
  get webLinksFormArray() {
    return this.registrationForm.get("webLinks");
  }
  onSubmit() {
    // Call the API to save changes
    if (this.account) {
      var _formValue$webLinks, _formValue$contactInf, _formValue$contactInf2, _formValue$contactInf3;
      // Prepare the account object with form values
      const formValue = this.registrationForm.value;
      // Prepare the account object for update
      const updatedAccount = {
        ...this.account,
        ...formValue,
        type: "user",
        name: formValue.name,
        tagline: formValue.tagline,
        description: formValue.description || "",
        webLinks: ((_formValue$webLinks = formValue.webLinks) === null || _formValue$webLinks === void 0 ? void 0 : _formValue$webLinks.map(link => ({
          name: link.name,
          url: link.url,
          category: link.category || ""
        }))) || [],
        contactInformation: {
          ...this.account.contactInformation,
          ...formValue.contactInformation,
          emails: ((_formValue$contactInf = formValue.contactInformation.emails) === null || _formValue$contactInf === void 0 ? void 0 : _formValue$contactInf.map(email => ({
            name: email.name || null,
            email: email.email
          }))) || [],
          phoneNumbers: ((_formValue$contactInf2 = formValue.contactInformation.phoneNumbers) === null || _formValue$contactInf2 === void 0 ? void 0 : _formValue$contactInf2.map(phone => ({
            countryCode: phone.countryCode || null,
            number: phone.number || null,
            type: phone.type || null,
            isEmergencyNumber: phone.isEmergencyNumber || false
          }))) || [],
          addresses: ((_formValue$contactInf3 = formValue.contactInformation.addresses) === null || _formValue$contactInf3 === void 0 ? void 0 : _formValue$contactInf3.map(address => ({
            name: address.name || null,
            street: address.street || null,
            city: address.city || null,
            state: address.state || null,
            zipcode: address.zipcode || null,
            country: address.country || null
          }))) || [],
          preferredMethodOfContact: formValue.contactInformation.preferredMethodOfContact
        }
      };
      // Now update the document with the updatedAccount
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.updateAccount({
        account: updatedAccount
      }));
      if (this.redirectSubmit) {
        // Redirect to the user profile page
        this.router.navigate([`/account/${this.account.id}`]);
      }
    }
  }
  loadFormData() {
    var _this$account$webLink, _this$account$contact, _this$account$contact2, _this$account$contact3, _this$account$contact4, _this$account$contact5, _this$account$contact6;
    if (!this.account) return;
    // Reset the form arrays to ensure clean state
    while (this.webLinksFormArray.length !== 0) {
      this.webLinksFormArray.removeAt(0);
    }
    while (this.emailsFormArray.length !== 0) {
      this.emailsFormArray.removeAt(0);
    }
    while (this.phoneNumbersFormArray.length !== 0) {
      this.phoneNumbersFormArray.removeAt(0);
    }
    while (this.addressesFormArray.length !== 0) {
      this.addressesFormArray.removeAt(0);
    }
    // If there are webLinks, create a FormGroup for each
    (_this$account$webLink = this.account.webLinks) === null || _this$account$webLink === void 0 || _this$account$webLink.forEach(webLink => {
      this.webLinksFormArray.push(this.fb.group({
        name: [webLink.name],
        url: [webLink.url, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern(/^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/?].*)?$/)]],
        category: [webLink.category]
      }));
    });
    // If after loading there are no webLinks, add a blank one
    if (this.webLinksFormArray.length === 0) {
      this.addWebLink();
    }
    // Dynamically load emails and phone numbers from the account, or add a blank one if none exist
    (_this$account$contact = this.account.contactInformation) === null || _this$account$contact === void 0 || (_this$account$contact = _this$account$contact.emails) === null || _this$account$contact === void 0 || _this$account$contact.forEach(email => {
      this.emailsFormArray.push(this.fb.group({
        name: [email.name],
        email: [email.email, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.email]
      }));
    });
    if (this.emailsFormArray.length === 0) {
      this.addEmail();
    }
    (_this$account$contact2 = this.account.contactInformation) === null || _this$account$contact2 === void 0 || (_this$account$contact2 = _this$account$contact2.phoneNumbers) === null || _this$account$contact2 === void 0 || _this$account$contact2.forEach(phone => {
      this.phoneNumbersFormArray.push(this.fb.group({
        countryCode: [phone.countryCode],
        number: [phone.number, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^\\d{10}$")]],
        type: [phone.type],
        isEmergencyNumber: [phone.isEmergencyNumber]
      }));
    });
    if (this.phoneNumbersFormArray.length === 0) {
      this.addPhoneNumber();
    }
    (_this$account$contact3 = this.account.contactInformation) === null || _this$account$contact3 === void 0 || (_this$account$contact3 = _this$account$contact3.addresses) === null || _this$account$contact3 === void 0 || _this$account$contact3.forEach(address => {
      this.addressesFormArray.push(this.fb.group({
        name: [address === null || address === void 0 ? void 0 : address.name],
        street: [address === null || address === void 0 ? void 0 : address.street, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[a-zA-Z0-9\\s,]*$")],
        city: [address === null || address === void 0 ? void 0 : address.city, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[a-zA-Z\\s]*$")],
        state: [address === null || address === void 0 ? void 0 : address.state],
        zipcode: [address === null || address === void 0 ? void 0 : address.zipcode, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[0-9]*$")],
        country: [address === null || address === void 0 ? void 0 : address.country]
        // isPrimaryAddress: [address?.isPrimaryAddress || false],
      }));
    });
    if (this.addressesFormArray.length === 0) {
      this.addAddress();
    }
    // Load other form data as before
    this.registrationForm.patchValue({
      name: this.account.name,
      description: this.account.description,
      tagline: this.account.tagline,
      contactInformation: {
        emails: ((_this$account$contact4 = this.account.contactInformation) === null || _this$account$contact4 === void 0 || (_this$account$contact4 = _this$account$contact4.emails) === null || _this$account$contact4 === void 0 ? void 0 : _this$account$contact4.map(email => ({
          name: email.name,
          email: email.email
        }))) || [this.createEmailFormGroup()],
        phoneNumbers: ((_this$account$contact5 = this.account.contactInformation) === null || _this$account$contact5 === void 0 || (_this$account$contact5 = _this$account$contact5.phoneNumbers) === null || _this$account$contact5 === void 0 ? void 0 : _this$account$contact5.map(phone => ({
          countryCode: phone.countryCode,
          number: phone.number,
          type: phone.type,
          isEmergencyNumber: phone.isEmergencyNumber
        }))) || [this.createPhoneNumberFormGroup()],
        addresses: ((_this$account$contact6 = this.account.contactInformation) === null || _this$account$contact6 === void 0 ? void 0 : _this$account$contact6.addresses) || [this.createAddressFormGroup()]
      }
    });
  }
  /**
   * Adds a new email form group to the emails form array, up to a max of maxEmails.
   * This allows an additional email input to be displayed in the form.
   */
  addEmail() {
    if (this.emailsFormArray.length < this.maxEmails) {
      this.emailsFormArray.push(this.createEmailFormGroup());
    }
  }
  removeEmail(index) {
    this.emailsFormArray.removeAt(index);
  }
  createEmailFormGroup() {
    return this.fb.group({
      name: [""],
      email: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.email]]
    });
  }
  createPhoneNumberFormGroup() {
    return this.fb.group({
      countryCode: [""],
      number: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^\\d{10}$")]],
      type: [""],
      isEmergencyNumber: [false]
    });
  }
  addPhoneNumber() {
    if (this.phoneNumbersFormArray.length < this.maxPhoneNumbers) {
      this.phoneNumbersFormArray.push(this.createPhoneNumberFormGroup());
    }
  }
  removePhoneNumber(index) {
    // Remove the phone number form group at the given index
    this.phoneNumbersFormArray.removeAt(index);
  }
  createWebLinkFormGroup() {
    return this.fb.group({
      name: ["", []],
      url: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern(/^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/?].*)?$/)]],
      category: [""]
    });
  }
  addWebLink() {
    if (this.webLinksFormArray.length < this.maxLinks) {
      this.webLinksFormArray.push(this.createWebLinkFormGroup());
    }
  }
  removeWebLink(index) {
    // Remove the phone number form group at the given index
    this.webLinksFormArray.removeAt(index);
  }
  createAddressFormGroup() {
    return this.fb.group({
      name: [""],
      street: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[a-zA-Z0-9\\s,]*$")],
      city: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[a-zA-Z\\s]*$")],
      state: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[a-zA-Z\\s]*$")],
      zipcode: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[0-9]*$")],
      country: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern("^[a-zA-Z\\s]*$")],
      isPrimaryAddress: [false]
    });
  }
  addAddress() {
    this.addressesFormArray.push(this.createAddressFormGroup());
  }
  removeAddress(index) {
    this.addressesFormArray.removeAt(index);
  }
}
_UserRegistrationComponent = UserRegistrationComponent;
_UserRegistrationComponent.ɵfac = function UserRegistrationComponent_Factory(t) {
  return new (t || _UserRegistrationComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_5__.Store), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_6__.Router));
};
_UserRegistrationComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
  type: _UserRegistrationComponent,
  selectors: [["app-user-registration"]],
  inputs: {
    account: "account",
    redirectSubmit: "redirectSubmit"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵNgOnChangesFeature"]],
  decls: 71,
  vars: 16,
  consts: [[3, "ngSubmit", "formGroup"], [3, "multiple", "value"], ["value", "basicInformation", "toggleIcon", "caret-down-circle", "toggleIconSlot", "start"], ["slot", "header", "color", "primary"], ["slot", "content"], ["label", "Name", "label-placement", "floating", "fill", "outline", "type", "text", "inputmode", "text", "formControlName", "name", "minlength", "1", "maxlength", "255", "placeholder", "Enter Name"], ["color", "danger", 4, "ngIf"], ["formControlName", "tagline", "minlength", "1", "maxlength", "255", "label", "Tagline", "label-placement", "floating", "fill", "outline", "placeholder", "Enter Tagline"], ["label", "Description", "label-placement", "floating", "fill", "outline", "placeholder", "Enter Description", "formControlName", "description", "rows", "5", "minlength", "0", "maxlength", "1000", 3, "counter"], ["color", "tertiary"], ["formArrayName", "webLinks"], [3, "formGroupName", 4, "ngFor", "ngForOf"], ["fill", "clear", 3, "click", "disabled"], ["slot", "start", "name", "add-circle-outline"], ["value", "contactInformation", "toggleIcon", "caret-down-circle", "toggleIconSlot", "start"], ["formArrayName", "contactInformation"], ["formArrayName", "emails"], ["formArrayName", "phoneNumbers"], ["formArrayName", "addresses"], ["type", "submit", "expand", "block", 1, "custom-ion-button", 3, "disabled"], ["color", "danger"], [3, "formGroupName"], ["label", "Category", "label-placement", "stacked", "fill", "outline", "formControlName", "category", "interface", "popover", "placeholder", "Select One"], ["value", "Social Media"], ["value", "Donation"], ["value", "Hobbies"], ["value", "Publications"], ["value", "Portfolio"], ["value", "Personal Website"], ["value", "External Resources"], ["value", "Other"], ["label", "Name", "label-placement", "floating", "fill", "outline", "formControlName", "name", "type", "text"], ["label", "URL", "label-placement", "floating", "fill", "outline", "formControlName", "url", "type", "text", "minlength", "0", "maxlength", "100"], [4, "ngIf"], ["size", "1"], ["fill", "clear", 3, "click"], ["slot", "icon-only", "name", "trash-outline", 1, "remove-icon"], ["label", "Name", "label-placement", "floating", "fill", "outline", "formControlName", "name", "type", "text", "minlength", "0", "maxlength", "50"], ["label", "Email", "label-placement", "floating", "fill", "outline", "formControlName", "email", "type", "email", "minlength", "0", "maxlength", "50"], ["size", "2"], ["label", "Type", "label-placement", "stacked", "fill", "outline", "formControlName", "type", "interface", "popover", "placeholder", "Select One"], ["value", "Mobile"], ["value", "Home"], ["value", "Work"], ["formControlName", "countryCode", "label", "Country Code", "label-placement", "stacked", "placeholder", "Select One", "fill", "outline", "interface", "popover"], [3, "value", 4, "ngFor", "ngForOf"], ["size", "4"], ["label", "Number", "label-placement", "floating", "fill", "outline", "formControlName", "number", "type", "tel", "minlength", "0", "maxlength", "10"], ["lines", "none"], ["slot", "start", "formControlName", "isEmergencyNumber"], [3, "value"], ["label", "Address Name", "label-placement", "floating", "fill", "outline", "formControlName", "name", "type", "text", "minlength", "0", "maxlength", "50"], ["label", "Street Address", "label-placement", "floating", "fill", "outline", "formControlName", "street", "type", "text", "minlength", "0", "maxlength", "50"], ["label", "City", "label-placement", "floating", "fill", "outline", "formControlName", "city", "type", "text", "minlength", "0", "maxlength", "50"], ["formControlName", "country", "label", "Country", "label-placement", "stacked", "placeholder", "Select Country", "fill", "outline", "interface", "popover"], ["formControlName", "state", "label", "State", "label-placement", "stacked", "placeholder", "Select State", "fill", "outline", "interface", "popover"], ["label", "Zip/Postal Code", "label-placement", "floating", "fill", "outline", "formControlName", "zipcode", "type", "text", "minlength", "0", "maxlength", "5"], ["slot", "start", "formControlName", "isPrimaryAddress"]],
  template: function UserRegistrationComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "form", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngSubmit", function UserRegistrationComponent_Template_form_ngSubmit_0_listener() {
        return ctx.onSubmit();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "ion-accordion-group", 1)(2, "ion-accordion", 2)(3, "ion-item", 3)(4, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Basic Information");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "div", 4)(7, "ion-grid")(8, "ion-row")(9, "ion-col")(10, "ion-row")(11, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](12, "ion-input", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](13, UserRegistrationComponent_ion_note_13_Template, 2, 0, "ion-note", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "ion-row")(15, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](16, "ion-input", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](17, UserRegistrationComponent_ion_note_17_Template, 2, 0, "ion-note", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](18, "ion-col")(19, "ion-row")(20, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](21, "ion-textarea", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "ion-item-divider")(23, "ion-label", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](24, "Web Links");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](25, "div", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](26, UserRegistrationComponent_ion_grid_26_Template, 28, 2, "ion-grid", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](27, "ion-button", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UserRegistrationComponent_Template_ion_button_click_27_listener() {
        return ctx.addWebLink();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](28, "ion-icon", 13);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](29, " Add Link ");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](30, "ion-accordion", 14)(31, "ion-item", 3)(32, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](33, "Contact Information");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](34, "div", 4)(35, "ion-grid", 15)(36, "ion-row")(37, "ion-col")(38, "ion-item-divider")(39, "ion-label", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](40, "Emails");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](41, "div", 16);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](42, UserRegistrationComponent_div_42_Template, 11, 2, "div", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](43, "ion-button", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UserRegistrationComponent_Template_ion_button_click_43_listener() {
        return ctx.addEmail();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](44, "ion-icon", 13);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](45, " Add Email ");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](46, "ion-row")(47, "ion-col")(48, "ion-item-divider")(49, "ion-label", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](50, "Phone Numbers");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](51, "div", 17);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](52, UserRegistrationComponent_div_52_Template, 25, 3, "div", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](53, "ion-button", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UserRegistrationComponent_Template_ion_button_click_53_listener() {
        return ctx.addPhoneNumber();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](54, "ion-icon", 13);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](55, " Add Phone Number ");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](56, "ion-row")(57, "ion-col")(58, "ion-item-divider")(59, "ion-label", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](60, "Addresses");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](61, "div", 18);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](62, UserRegistrationComponent_div_62_Template, 36, 6, "div", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](63, "ion-button", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UserRegistrationComponent_Template_ion_button_click_63_listener() {
        return ctx.addAddress();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](64, "ion-icon", 13);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](65, " Add Address ");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](66, "ion-grid")(67, "ion-row")(68, "ion-col")(69, "ion-button", 19);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](70, " Save and Continue ");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
    }
    if (rf & 2) {
      let tmp_3_0;
      let tmp_4_0;
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroup", ctx.registrationForm);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("multiple", true)("value", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction0"](15, _c0));
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](12);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_3_0 = ctx.registrationForm.get("name")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx.registrationForm.get("name")) == null ? null : tmp_3_0.touched));
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ((tmp_4_0 = ctx.registrationForm.get("tagline")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx.registrationForm.get("tagline")) == null ? null : tmp_4_0.touched));
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("counter", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.webLinksFormArray.controls);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.webLinksFormArray.controls.length >= ctx.maxLinks);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](15);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.emailsFormArray.controls);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.emailsFormArray.controls.length >= ctx.maxEmails);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](9);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.phoneNumbersFormArray.controls);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.phoneNumbersFormArray.controls.length >= ctx.maxPhoneNumbers);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](9);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.addressesFormArray.controls);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.addressesFormArray.controls.length >= ctx.maxAddresses);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.registrationForm.invalid);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.MaxLengthValidator, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonAccordion, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonAccordionGroup, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonCheckbox, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonInput, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonItemDivider, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonNote, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonSelect, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonSelectOption, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonTextarea, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.BooleanValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.SelectValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.TextValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormGroupName, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormArrayName],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL3JlZ2lzdHJhdGlvbi9jb21wb25lbnRzL3VzZXItcmVnaXN0cmF0aW9uL3VzZXItcmVnaXN0cmF0aW9uLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0ZBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtOiBBbGxvd2luZyBVc2VycyBhbmQgT3JnYW5pemF0aW9ucyB0byBDb2xsYWJvcmF0ZS5cbiogQ29weXJpZ2h0IChDKSAyMDIzICBBU0NFTkR5bmFtaWNzIE5GUFxuKlxuKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uXG4qXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4qIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZFxuKiBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4qIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4qIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuKiBhbG9uZyB3aXRoIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ }),

/***/ 8239:
/*!*************************************************************************!*\
  !*** ./src/app/modules/account/pages/registration/registration.page.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RegistrationPage: () => (/* binding */ RegistrationPage)
/* harmony export */ });
/* harmony import */ var _state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../state/selectors/account.selectors */ 8686);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../state/actions/account.actions */ 8314);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 4406);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ 1856);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ 5840);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 1082);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs/operators */ 1969);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _core_services_meta_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../core/services/meta.service */ 6369);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../shared/components/app-header/app-header.component */ 8245);
/* harmony import */ var _components_group_registration_group_registration_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/group-registration/group-registration.component */ 5532);
/* harmony import */ var _components_user_registration_user_registration_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/user-registration/user-registration.component */ 4460);
var _RegistrationPage;












function RegistrationPage_ion_content_2_ion_grid_7_div_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "app-user-registration", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const account_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("account", account_r3);
  }
}
function RegistrationPage_ion_content_2_ion_grid_7_div_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "app-group-registration", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const account_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("account", account_r3);
  }
}
function RegistrationPage_ion_content_2_ion_grid_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-grid")(1, "ion-row")(2, "ion-col", 6)(3, "ion-card", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function RegistrationPage_ion_content_2_ion_grid_7_Template_ion_card_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r1.selectType("user"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "ion-card-content");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](5, "ion-icon", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](7, "User");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9, "Create a personal user account.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "ion-col", 6)(11, "ion-card", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function RegistrationPage_ion_content_2_ion_grid_7_Template_ion_card_click_11_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r1.selectType("group"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "ion-card-content");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](13, "ion-icon", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](14, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](15, "Group");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](16, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](17, "Create an account for your group or organization.");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](18, "ion-row")(19, "ion-col", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](20, RegistrationPage_ion_content_2_ion_grid_7_div_20_Template, 2, 1, "div", 5)(21, RegistrationPage_ion_content_2_ion_grid_7_div_21_Template, 2, 1, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵclassProp"]("selected-card", ctx_r1.selectedType === "user");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵclassProp"]("selected-card", ctx_r1.selectedType === "group");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r1.selectedType === "user");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r1.selectedType === "group");
  }
}
function RegistrationPage_ion_content_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-content", 3)(1, "div", 4)(2, "ion-text")(3, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4, "Get Started");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6, "Choose an account type to create:");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](7, RegistrationPage_ion_content_2_ion_grid_7_Template, 22, 6, "ion-grid", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](8, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("fullscreen", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](8, 2, ctx_r1.account$));
  }
}
function RegistrationPage_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, "Loading...");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
class RegistrationPage {
  constructor(metaService, route, router, store) {
    this.metaService = metaService;
    this.route = route;
    this.router = router;
    this.store = store;
    this.selectedType = "";
  }
  ngOnInit() {
    // Get accountId as an observable
    this.accountId$ = this.route.paramMap.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(params => params.get("accountId")), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.filter)(accountId => accountId !== null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.shareReplay)(1));
    // Dispatch action to load the account when accountId is available
    this.accountId$.subscribe(accountId => {
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_1__.loadAccount({
        accountId
      }));
    });
    // Select the account from the store
    this.account$ = this.accountId$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.switchMap)(accountId => this.store.select((0,_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_0__.selectAccountById)(accountId))), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.tap)(account => {
      if (account !== null && account !== void 0 && account.type) {
        this.router.navigate([`/account/${account.id}`]);
      }
    }));
  }
  ionViewWillEnter() {
    // Default Meta Tags
    this.metaService.updateMetaTags("Registration | ASCENDynamics NFP", "Create your account and join the ASCENDynamics NFP community today.", "registration, sign up, volunteer, nonprofits", {
      title: "Registration | ASCENDynamics NFP",
      description: "Sign up for ASCENDynamics NFP to explore and connect with impactful opportunities.",
      url: "https://app.ASCENDynamics.org/registration",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    }, {
      card: "summary_large_image",
      title: "Join ASCENDynamics NFP",
      description: "Sign up to connect with meaningful opportunities and start making a difference.",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    });
  }
  selectType(type) {
    this.selectedType = type;
  }
}
_RegistrationPage = RegistrationPage;
_RegistrationPage.ɵfac = function RegistrationPage_Factory(t) {
  return new (t || _RegistrationPage)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_core_services_meta_service__WEBPACK_IMPORTED_MODULE_2__.MetaService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_12__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_12__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_13__.Store));
};
_RegistrationPage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
  type: _RegistrationPage,
  selectors: [["app-registration"]],
  decls: 6,
  vars: 5,
  consts: [["loading", ""], [3, "title"], [3, "fullscreen", 4, "ngIf", "ngIfElse"], [3, "fullscreen"], [1, "registration-description"], [4, "ngIf"], ["size-md", "6"], [3, "click"], ["name", "person-outline", "size", "large"], ["name", "people-outline", "size", "large"], ["size", "12"], [3, "account"]],
  template: function RegistrationPage_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-header");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "app-header", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](2, RegistrationPage_ion_content_2_Template, 9, 4, "ion-content", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](3, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](4, RegistrationPage_ng_template_4_Template, 2, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplateRefExtractor"]);
    }
    if (rf & 2) {
      const loading_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵreference"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("title", "Registration");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](3, 3, ctx.account$))("ngIfElse", loading_r4);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_14__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonCard, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonCardContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonCardTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonText, _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_3__.AppHeaderComponent, _components_group_registration_group_registration_component__WEBPACK_IMPORTED_MODULE_4__.GroupRegistrationComponent, _components_user_registration_user_registration_component__WEBPACK_IMPORTED_MODULE_5__.UserRegistrationComponent, _angular_common__WEBPACK_IMPORTED_MODULE_14__.AsyncPipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.registration-description[_ngcontent-%COMP%] {\n  text-align: center;\n  margin: 20px 0;\n}\n\nion-card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n  cursor: pointer;\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n  border: 1px solid #333;\n}\n\nion-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-5px);\n  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);\n}\n\nion-card-content[_ngcontent-%COMP%] {\n  text-align: center;\n}\n\nion-icon[_ngcontent-%COMP%] {\n  font-size: 3em;\n  margin-bottom: 15px;\n}\n\nion-card-title[_ngcontent-%COMP%] {\n  font-size: 1.2em;\n  font-weight: bold;\n  margin-bottom: 10px;\n}\n\n.app-user-registration[_ngcontent-%COMP%], .app-group-registration[_ngcontent-%COMP%] {\n  margin-top: 30px;\n}\n\n.selected-card[_ngcontent-%COMP%] {\n  border: 2px solid #e87121;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL3JlZ2lzdHJhdGlvbi9yZWdpc3RyYXRpb24ucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0ZBQUE7QUFtQkE7RUFDRSxrQkFBQTtFQUNBLGNBQUE7QUFDRjs7QUFFQTtFQUNFLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFlBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsYUFBQTtFQUNBLGVBQUE7RUFDQSx3Q0FBQTtFQUNBLHFEQUNFO0VBRUYsc0JBQUE7QUFERjs7QUFJQTtFQUNFLDJCQUFBO0VBQ0EseUNBQUE7QUFERjs7QUFJQTtFQUNFLGtCQUFBO0FBREY7O0FBSUE7RUFDRSxjQUFBO0VBQ0EsbUJBQUE7QUFERjs7QUFJQTtFQUNFLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxtQkFBQTtBQURGOztBQUlBOztFQUVFLGdCQUFBO0FBREY7O0FBSUE7RUFDRSx5QkFBQTtBQURGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4ucmVnaXN0cmF0aW9uLWRlc2NyaXB0aW9uIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBtYXJnaW46IDIwcHggMDtcbn1cblxuaW9uLWNhcmQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBmbGV4LWdyb3c6IDE7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwYWRkaW5nOiAyMHB4O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJveC1zaGFkb3c6IDAgNHB4IDhweCByZ2JhKDAsIDAsIDAsIDAuMSk7XG4gIHRyYW5zaXRpb246XG4gICAgdHJhbnNmb3JtIDAuM3MgZWFzZSxcbiAgICBib3gtc2hhZG93IDAuM3MgZWFzZTtcbiAgYm9yZGVyOiAxcHggc29saWQgIzMzMztcbn1cblxuaW9uLWNhcmQ6aG92ZXIge1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTVweCk7XG4gIGJveC1zaGFkb3c6IDAgNnB4IDEycHggcmdiYSgwLCAwLCAwLCAwLjIpO1xufVxuXG5pb24tY2FyZC1jb250ZW50IHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG5pb24taWNvbiB7XG4gIGZvbnQtc2l6ZTogM2VtO1xuICBtYXJnaW4tYm90dG9tOiAxNXB4O1xufVxuXG5pb24tY2FyZC10aXRsZSB7XG4gIGZvbnQtc2l6ZTogMS4yZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBtYXJnaW4tYm90dG9tOiAxMHB4O1xufVxuXG4uYXBwLXVzZXItcmVnaXN0cmF0aW9uLFxuLmFwcC1ncm91cC1yZWdpc3RyYXRpb24ge1xuICBtYXJnaW4tdG9wOiAzMHB4O1xufVxuXG4uc2VsZWN0ZWQtY2FyZCB7XG4gIGJvcmRlcjogMnB4IHNvbGlkICNlODcxMjE7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 4584:
/*!******************************************************************************************!*\
  !*** ./src/app/modules/account/pages/settings/components/settings/settings.component.ts ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsComponent: () => (/* binding */ SettingsComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../state/actions/account.actions */ 8314);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ 7353);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _SettingsComponent;
/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/









function SettingsComponent_ion_select_option_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "ion-select-option", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const lang_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", lang_r1.code);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](lang_r1.text);
  }
}
class SettingsComponent {
  constructor(fb, store, translateService) {
    this.fb = fb;
    this.store = store;
    this.translateService = translateService;
    this.languageChange = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
    this.languageList = [{
      code: "en",
      name: "english",
      text: "English"
    }, {
      code: "fr",
      name: "french",
      text: "Français"
    }];
    this.settingsForm = this.fb.group({
      privacy: ["public", _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required],
      language: ["en"]
    });
  }
  ngOnChanges() {
    this.loadFormData();
  }
  onLanguageChange() {
    var _this$settingsForm$va;
    const lang = (_this$settingsForm$va = this.settingsForm.value.language) !== null && _this$settingsForm$va !== void 0 ? _this$settingsForm$va : "en";
    this.translateService.use(lang);
    this.languageChange.emit(lang);
  }
  updateSetting() {
    var _this$authUser;
    if ((_this$authUser = this.authUser) !== null && _this$authUser !== void 0 && _this$authUser.uid && this.account) {
      var _this$account$setting;
      const formValue = this.settingsForm.value;
      const updatedAccount = {
        ...this.account,
        privacy: formValue.privacy || "public",
        accessibility: {
          preferredLanguage: formValue.language
        },
        settings: {
          theme: ((_this$account$setting = this.account.settings) === null || _this$account$setting === void 0 ? void 0 : _this$account$setting.theme) || "light",
          language: formValue.language || "en"
        }
      };
      // Dispatch action to update the account
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.updateAccount({
        account: updatedAccount
      }));
    }
  }
  loadFormData() {
    var _this$account$accessi, _this$account$accessi2;
    if (!this.account) return;
    // Update the form with the account data
    this.settingsForm.patchValue({
      privacy: this.account.privacy || "public",
      language: (_this$account$accessi = (_this$account$accessi2 = this.account.accessibility) === null || _this$account$accessi2 === void 0 ? void 0 : _this$account$accessi2.preferredLanguage) !== null && _this$account$accessi !== void 0 ? _this$account$accessi : "en"
    });
  }
  toggleDarkTheme(event) {
    const isDarkModeEnabled = event.detail.checked;
    document.body.classList.toggle("dark", isDarkModeEnabled);
  }
}
_SettingsComponent = SettingsComponent;
_SettingsComponent.ɵfac = function SettingsComponent_Factory(t) {
  return new (t || _SettingsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_3__.Store), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslateService));
};
_SettingsComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
  type: _SettingsComponent,
  selectors: [["app-settings-form"]],
  inputs: {
    authUser: "authUser",
    account: "account"
  },
  outputs: {
    languageChange: "languageChange"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵNgOnChangesFeature"]],
  decls: 21,
  vars: 2,
  consts: [[3, "formGroup"], ["formControlName", "privacy"], ["value", "public"], ["value", "friends-only"], ["value", "private"], ["formControlName", "language", 3, "ionChange"], [3, "value", 4, "ngFor", "ngForOf"], ["expand", "full", 3, "click"], [3, "value"]],
  template: function SettingsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "ion-content")(1, "ion-card")(2, "form", 0)(3, "ion-list")(4, "ion-item")(5, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "Privacy Settings");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "ion-select", 1)(8, "ion-select-option", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "Public");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "ion-select-option", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "Friends-only");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "ion-select-option", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "Private");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "ion-item")(15, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "Language");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "ion-select", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ionChange", function SettingsComponent_Template_ion_select_ionChange_17_listener() {
        return ctx.onLanguageChange();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](18, SettingsComponent_ion_select_option_18_Template, 2, 2, "ion-select-option", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "ion-button", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function SettingsComponent_Template_ion_button_click_19_listener() {
        return ctx.updateSetting();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "Save Changes");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx.settingsForm);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](16);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.languageList);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonCard, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonList, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonSelect, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonSelectOption, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.SelectValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlName],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL3NldHRpbmdzL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 7911:
/*!*****************************************************************!*\
  !*** ./src/app/modules/account/pages/settings/settings.page.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsPage: () => (/* binding */ SettingsPage)
/* harmony export */ });
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../state/selectors/account.selectors */ 8686);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 1082);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _core_services_meta_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../core/services/meta.service */ 6369);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../shared/components/app-header/app-header.component */ 8245);
/* harmony import */ var _components_settings_settings_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/settings/settings.component */ 4584);
var _SettingsPage;










function SettingsPage_ng_container_3_app_settings_form_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "app-settings-form", 4);
  }
  if (rf & 2) {
    const account_r1 = ctx.ngIf;
    const authUser_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("authUser", authUser_r2)("account", account_r1);
  }
}
function SettingsPage_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](1, SettingsPage_ng_container_3_app_settings_form_1_Template, 1, 2, "app-settings-form", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 1, ctx_r2.account$));
  }
}
class SettingsPage {
  constructor(metaService, store) {
    this.metaService = metaService;
    this.store = store;
    // Get the authUser observable
    this.authUser$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_0__.selectAuthUser);
    // Use switchMap to load the account and select the account observable based on authUser
    this.account$ = this.authUser$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.switchMap)(authUser => {
      if (authUser !== null && authUser !== void 0 && authUser.uid) {
        return this.store.select((0,_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAccountById)(authUser.uid));
      }
      return [undefined];
    }));
  }
  ionViewWillEnter() {
    this.metaService.updateMetaTags("Settings | ASCENDynamics NFP", "Customize your settings and preferences on ASCENDynamics NFP.", "settings, preferences, account, customization", {
      title: "Settings | ASCENDynamics NFP",
      description: "Manage your preferences and account settings on ASCENDynamics NFP.",
      url: "https://app.ASCENDynamics.org/settings",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    }, {
      card: "summary",
      title: "Settings | ASCENDynamics NFP",
      description: "Update your account preferences and settings on ASCENDynamics NFP.",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    });
  }
}
_SettingsPage = SettingsPage;
_SettingsPage.ɵfac = function SettingsPage_Factory(t) {
  return new (t || _SettingsPage)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_core_services_meta_service__WEBPACK_IMPORTED_MODULE_2__.MetaService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_7__.Store));
};
_SettingsPage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({
  type: _SettingsPage,
  selectors: [["app-settings"]],
  decls: 5,
  vars: 5,
  consts: [[3, "title"], [3, "fullscreen"], [4, "ngIf"], [3, "authUser", "account", 4, "ngIf"], [3, "authUser", "account"]],
  template: function SettingsPage_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-header");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "app-header", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "ion-content", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](3, SettingsPage_ng_container_3_Template, 3, 3, "ng-container", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](4, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("title", "Settings");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("fullscreen", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](4, 3, ctx.authUser$));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonHeader, _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_3__.AppHeaderComponent, _components_settings_settings_component__WEBPACK_IMPORTED_MODULE_4__.SettingsComponent, _angular_common__WEBPACK_IMPORTED_MODULE_8__.AsyncPipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL3NldHRpbmdzL3NldHRpbmdzLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OytGQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 3399:
/*!***********************************************************!*\
  !*** ./src/app/modules/account/pages/users/users.page.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UsersPage: () => (/* binding */ UsersPage)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 3150);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 5536);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs */ 1640);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! rxjs */ 3901);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ 1856);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 5117);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs/operators */ 6816);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs/operators */ 3396);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs/operators */ 9746);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! rxjs/operators */ 1082);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs/operators */ 4406);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../state/selectors/account.selectors */ 8686);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../state/actions/account.actions */ 8314);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _core_services_meta_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../core/services/meta.service */ 6369);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/components/app-header/app-header.component */ 8245);
/* harmony import */ var _shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../shared/components/pagination/pagination.component */ 4815);
var _UsersPage;













const _c0 = a0 => ["/account/", a0];
function UsersPage_ng_container_6_ion_item_1_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](0, "img", 11);
  }
  if (rf & 2) {
    const item_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("alt", item_r2.name)("src", item_r2.iconImage, _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"]);
  }
}
function UsersPage_ng_container_6_ion_item_1_ion_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function UsersPage_ng_container_6_ion_item_1_ion_button_8_Template_ion_button_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r3);
      const item_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      $event.stopPropagation();
      $event.preventDefault();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r3.sendRequest(item_r2));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Send Request ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function UsersPage_ng_container_6_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-item", 7)(1, "ion-thumbnail", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](2, UsersPage_ng_container_6_ion_item_1_img_2_Template, 1, 2, "img", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "ion-label")(4, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](8, UsersPage_ng_container_6_ion_item_1_ion_button_8_Template, 2, 0, "ion-button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](9, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction1"](7, _c0, item_r2.id));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", item_r2.iconImage);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](item_r2 == null ? null : item_r2.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](item_r2 == null ? null : item_r2.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](9, 5, ctx_r3.showRequestButton(item_r2)));
  }
}
function UsersPage_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](1, UsersPage_ng_container_6_ion_item_1_Template, 10, 9, "ion-item", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](2, 1, ctx_r3.paginatedAccounts$));
  }
}
function UsersPage_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-item")(1, "ion-label", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, " No users found. Try a different search term. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
}
class UsersPage {
  constructor(metaService, store) {
    this.metaService = metaService;
    this.store = store;
    this.searchTerms = new rxjs__WEBPACK_IMPORTED_MODULE_7__.Subject();
    this.searchedValue = "";
    // Pagination State
    this.pageSize = 10; // Number of users per page
    this.currentPageSubject = new rxjs__WEBPACK_IMPORTED_MODULE_8__.BehaviorSubject(1);
    this.currentPage$ = this.currentPageSubject.asObservable();
    this.loading$ = this.store.select(_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAccountLoading);
  }
  ionViewWillEnter() {
    this.loadRelatedAccountsForAuthUser();
    this.metaService.updateMetaTags("Search Volunteers | ASCENDynamics NFP", "Find opportunities, groups, and profiles tailored to your interests on ASCENDynamics NFP.", "search, opportunities, volunteer, nonprofits", {
      title: "Search Volunteers | ASCENDynamics NFP",
      description: "Discover listings, profiles, and groups that match your search criteria.",
      url: "https://app.ASCENDynamics.org/search",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    }, {
      card: "summary_large_image",
      title: "Search Results",
      description: "Browse search results and find opportunities that match your interests.",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    });
  }
  loadRelatedAccountsForAuthUser() {
    this.authUser$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.filter)(authUser => authUser !== null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.take)(1)).subscribe(authUser => {
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.loadRelatedAccounts({
        accountId: authUser.uid
      }));
    });
  }
  ngOnInit() {
    this.authUser$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_0__.selectAuthUser);
    this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.loadAccounts());
    const filteredAccounts$ = this.searchTerms.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.startWith)(this.searchedValue), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.debounceTime)(300), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.distinctUntilChanged)(), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_14__.switchMap)(term => this.store.select((0,_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__.selectFilteredAccounts)(term, "user"))));
    // Total Items for Pagination
    this.totalItems$ = filteredAccounts$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.map)(accounts => accounts.length));
    // Total Pages
    this.totalPages$ = this.totalItems$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.map)(totalItems => Math.ceil(totalItems / this.pageSize)));
    // Paginated Results
    this.paginatedAccounts$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_16__.combineLatest)([filteredAccounts$, this.currentPage$]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.map)(([accounts, currentPage]) => {
      const startIndex = (currentPage - 1) * this.pageSize;
      return accounts.slice(startIndex, startIndex + this.pageSize);
    }));
  }
  search(event) {
    const value = event.target.value;
    this.searchTerms.next(value);
  }
  goToPage(pageNumber) {
    this.currentPageSubject.next(pageNumber);
  }
  sendRequest(account) {
    this.authUser$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.take)(1)).subscribe(authUser => {
      if (!(authUser !== null && authUser !== void 0 && authUser.uid) || !account.id) {
        console.error("User ID or Account ID is missing");
        return;
      }
      const newRelatedAccount = {
        id: account.id,
        accountId: authUser.uid,
        initiatorId: authUser.uid,
        targetId: account.id,
        type: account.type,
        status: "pending",
        relationship: "friend",
        tagline: account.tagline,
        name: account.name,
        iconImage: account.iconImage,
        createdBy: authUser.uid,
        lastModifiedBy: authUser.uid
      };
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.createRelatedAccount({
        accountId: authUser.uid,
        relatedAccount: newRelatedAccount
      }));
    });
  }
  showRequestButton(item) {
    return this.authUser$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.filter)(authUser => authUser !== null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_14__.switchMap)(authUser => (0,rxjs__WEBPACK_IMPORTED_MODULE_16__.combineLatest)([(0,rxjs__WEBPACK_IMPORTED_MODULE_17__.of)(authUser), this.store.select((0,_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__.selectRelatedAccountsByAccountId)(authUser.uid))])), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.map)(([authUser, relatedAccounts]) => {
      if (authUser.uid === item.id) {
        return false;
      }
      // Check against the `relatedAccounts` from the state
      const shouldShowButton = !relatedAccounts.some(ra => (ra.initiatorId === item.id && ra.targetId === authUser.uid || ra.initiatorId === authUser.uid && ra.targetId === item.id) && ra.status !== "rejected");
      return shouldShowButton;
    }));
  }
}
_UsersPage = UsersPage;
_UsersPage.ɵfac = function UsersPage_Factory(t) {
  return new (t || _UsersPage)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_core_services_meta_service__WEBPACK_IMPORTED_MODULE_3__.MetaService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_18__.Store));
};
_UsersPage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
  type: _UsersPage,
  selectors: [["app-users"]],
  decls: 12,
  vars: 12,
  consts: [["noResultsTemplate", ""], [3, "title"], [3, "ionInput", "debounce"], [3, "fullscreen"], [4, "ngIf", "ngIfElse"], [3, "pageChange", "totalItems", "pageSize", "maxVisiblePages"], ["button", "", 3, "routerLink", 4, "ngFor", "ngForOf"], ["button", "", 3, "routerLink"], ["slot", "start"], [3, "alt", "src", 4, "ngIf"], ["slot", "end", "mode", "md", "expand", "block", 3, "click", 4, "ngIf"], [3, "alt", "src"], ["slot", "end", "mode", "md", "expand", "block", 3, "click"], [1, "ion-text-center"]],
  template: function UsersPage_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-header");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "app-header", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "ion-toolbar")(3, "ion-searchbar", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ionInput", function UsersPage_Template_ion_searchbar_ionInput_3_listener($event) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r1);
        return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx.search($event));
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "ion-content", 3)(5, "ion-list");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](6, UsersPage_ng_container_6_Template, 3, 3, "ng-container", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](7, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "app-pagination", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](9, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("pageChange", function UsersPage_Template_app_pagination_pageChange_8_listener($event) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r1);
        return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx.goToPage($event));
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](10, UsersPage_ng_template_10_Template, 3, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      let tmp_4_0;
      const noResultsTemplate_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵreference"](11);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("title", "Search Users");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("debounce", 300);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("fullscreen", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", (tmp_4_0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](7, 8, ctx.paginatedAccounts$)) == null ? null : tmp_4_0.length)("ngIfElse", noResultsTemplate_r5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("totalItems", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](9, 10, ctx.totalItems$) || 0)("pageSize", ctx.pageSize)("maxVisiblePages", 5);
    }
  },
  dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_19__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_20__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_20__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_21__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_21__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_21__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_21__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_21__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_21__.IonList, _ionic_angular__WEBPACK_IMPORTED_MODULE_21__.IonSearchbar, _ionic_angular__WEBPACK_IMPORTED_MODULE_21__.IonThumbnail, _ionic_angular__WEBPACK_IMPORTED_MODULE_21__.IonToolbar, _ionic_angular__WEBPACK_IMPORTED_MODULE_21__.TextValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_21__.RouterLinkDelegate, _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_4__.AppHeaderComponent, _shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_5__.PaginationComponent, _angular_common__WEBPACK_IMPORTED_MODULE_20__.AsyncPipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3BhZ2VzL3VzZXJzL3VzZXJzLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OytGQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 4096:
/*!************************************************************************!*\
  !*** ./src/app/modules/account/relatedAccount/pages/list/list.page.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ListPage: () => (/* binding */ ListPage)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 1640);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 3901);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ 4406);
/* harmony import */ var _state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../state/selectors/account.selectors */ 8686);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../state/actions/account.actions */ 8314);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ 5117);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _core_services_meta_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../core/services/meta.service */ 6369);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../shared/components/app-header/app-header.component */ 8245);
var _ListPage;













function ListPage_app_header_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "app-header", 3);
  }
  if (rf & 2) {
    const account_r1 = ctx.ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("defaultHref", "account/" + account_r1.id)("title", account_r1.name);
  }
}
function ListPage_ng_container_16_ion_item_2_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "img", 9);
  }
  if (rf & 2) {
    const relatedAccount_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("alt", relatedAccount_r2.name)("src", relatedAccount_r2.iconImage, _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsanitizeUrl"]);
  }
}
function ListPage_ng_container_16_ion_item_2_ion_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function ListPage_ng_container_16_ion_item_2_ion_button_8_Template_ion_button_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r3);
      const relatedAccount_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().$implicit;
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2);
      $event.stopPropagation();
      $event.preventDefault();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r3.removeRequest(relatedAccount_r2));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " Remove ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ListPage_ng_container_16_ion_item_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-item", 5)(1, "ion-thumbnail", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](2, ListPage_ng_container_16_ion_item_2_img_2_Template, 1, 2, "img", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "ion-label")(4, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](8, ListPage_ng_container_16_ion_item_2_ion_button_8_Template, 2, 0, "ion-button", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](9, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const relatedAccount_r2 = ctx.$implicit;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("routerLink", ctx_r3.getOtherId(relatedAccount_r2) ? "/account/" + ctx_r3.getOtherId(relatedAccount_r2) : "#");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", relatedAccount_r2.iconImage);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](relatedAccount_r2.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](relatedAccount_r2.tagline);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](9, 5, ctx_r3.showRemoveButton(relatedAccount_r2)));
  }
}
function ListPage_ng_container_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "ion-list");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](2, ListPage_ng_container_16_ion_item_2_Template, 10, 7, "ion-item", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const currentList_r5 = ctx.ngIf;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", currentList_r5)("ngForTrackBy", ctx_r3.trackById);
  }
}
function ListPage_ng_container_18_ng_container_1_ion_card_1_ion_item_9_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "img", 9);
  }
  if (rf & 2) {
    const relatedAccount_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("alt", relatedAccount_r6.name)("src", relatedAccount_r6.iconImage, _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsanitizeUrl"]);
  }
}
function ListPage_ng_container_18_ng_container_1_ion_card_1_ion_item_9_ion_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function ListPage_ng_container_18_ng_container_1_ion_card_1_ion_item_9_ion_button_8_Template_ion_button_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r7);
      const relatedAccount_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().$implicit;
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](4);
      $event.stopPropagation();
      $event.preventDefault();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r3.acceptRequest(relatedAccount_r6));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " Accept ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ListPage_ng_container_18_ng_container_1_ion_card_1_ion_item_9_ion_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function ListPage_ng_container_18_ng_container_1_ion_card_1_ion_item_9_ion_button_10_Template_ion_button_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r8);
      const relatedAccount_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().$implicit;
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](4);
      $event.stopPropagation();
      $event.preventDefault();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r3.rejectRequest(relatedAccount_r6));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " Reject ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ListPage_ng_container_18_ng_container_1_ion_card_1_ion_item_9_ion_button_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function ListPage_ng_container_18_ng_container_1_ion_card_1_ion_item_9_ion_button_12_Template_ion_button_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r9);
      const relatedAccount_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().$implicit;
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](4);
      $event.stopPropagation();
      $event.preventDefault();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r3.removeRequest(relatedAccount_r6));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " Remove ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ListPage_ng_container_18_ng_container_1_ion_card_1_ion_item_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-item", 5)(1, "ion-thumbnail", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](2, ListPage_ng_container_18_ng_container_1_ion_card_1_ion_item_9_img_2_Template, 1, 2, "img", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "ion-label")(4, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](8, ListPage_ng_container_18_ng_container_1_ion_card_1_ion_item_9_ion_button_8_Template, 2, 0, "ion-button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](9, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](10, ListPage_ng_container_18_ng_container_1_ion_card_1_ion_item_9_ion_button_10_Template, 2, 0, "ion-button", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](11, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](12, ListPage_ng_container_18_ng_container_1_ion_card_1_ion_item_9_ion_button_12_Template, 2, 0, "ion-button", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](13, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const relatedAccount_r6 = ctx.$implicit;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("routerLink", ctx_r3.getOtherId(relatedAccount_r6) ? "/account/" + ctx_r3.getOtherId(relatedAccount_r6) : "#");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", relatedAccount_r6.iconImage);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](relatedAccount_r6.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](relatedAccount_r6.tagline);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](9, 7, ctx_r3.showAcceptRejectButtons(relatedAccount_r6)));
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](11, 9, ctx_r3.showAcceptRejectButtons(relatedAccount_r6)));
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](13, 11, ctx_r3.showRemoveButton(relatedAccount_r6)));
  }
}
function ListPage_ng_container_18_ng_container_1_ion_card_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-card")(1, "ion-card-header")(2, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](4, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](5, "ion-card-subtitle");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](7, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](8, "ion-list");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](9, ListPage_ng_container_18_ng_container_1_ion_card_1_ion_item_9_Template, 14, 13, "ion-item", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    let tmp_6_0;
    const pendingList_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().ngIf;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"]("Pending ", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](4, 5, ctx_r3.title$), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate2"](" ", pendingList_r10.length, " pending ", (tmp_6_0 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](7, 7, ctx_r3.title$)) == null ? null : tmp_6_0.toLowerCase(), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", pendingList_r10)("ngForTrackBy", ctx_r3.trackById);
  }
}
function ListPage_ng_container_18_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](1, ListPage_ng_container_18_ng_container_1_ion_card_1_Template, 10, 9, "ion-card", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const pendingList_r10 = ctx.ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", pendingList_r10.length > 0);
  }
}
function ListPage_ng_container_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](1, ListPage_ng_container_18_ng_container_1_Template, 2, 1, "ng-container", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 1, ctx_r3.pendingRelatedAccountsList$));
  }
}
class ListPage {
  constructor(activatedRoute, metaService, store) {
    this.activatedRoute = activatedRoute;
    this.metaService = metaService;
    this.store = store;
    // Route Parameters
    this.accountId = null;
    this.listType = null;
    // Extract route parameters
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");
    this.listType = this.activatedRoute.snapshot.paramMap.get("listType");
  }
  ngOnInit() {
    // Select the authenticated user from the store
    this.currentUser$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAuthUser);
    if (this.accountId) {
      // Dispatch an action to load the account details if not already loaded
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.loadAccount({
        accountId: this.accountId
      }));
      // Select the specific account by ID
      this.account$ = this.store.select((0,_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_0__.selectAccountById)(this.accountId));
      // Select related accounts where initiatorId or targetId equals accountId
      this.relatedAccounts$ = this.store.select((0,_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_0__.selectRelatedAccountsByAccountId)(this.accountId));
      // Determine ownership based on current user and accountId
      this.isOwner$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.combineLatest)([this.currentUser$, (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.of)(this.accountId)]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.map)(([currentUser, accountId]) => (currentUser === null || currentUser === void 0 ? void 0 : currentUser.uid) === accountId));
      // Determine the title based on listType and account.type
      this.title$ = this.account$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.map)(account => {
        if (this.listType === "user" && (account === null || account === void 0 ? void 0 : account.type) === "user") {
          return "Friends";
        } else if (this.listType === "user" && (account === null || account === void 0 ? void 0 : account.type) === "group") {
          return "Members";
        } else if (this.listType === "group" && (account === null || account === void 0 ? void 0 : account.type) === "group") {
          return "Partners";
        } else if (this.listType === "group" && (account === null || account === void 0 ? void 0 : account.type) === "user") {
          return "Organizations";
        }
        return "";
      }));
      // Filter related accounts into current and pending lists
      this.currentRelatedAccountsList$ = this.relatedAccounts$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.map)(relatedAccounts => relatedAccounts.filter(ra => ra.type === this.listType && ra.status === "accepted")));
      this.pendingRelatedAccountsList$ = this.relatedAccounts$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.map)(relatedAccounts => relatedAccounts.filter(ra => ra.type === this.listType && ra.status === "pending")));
    }
  }
  ionViewWillEnter() {
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");
    this.listType = this.activatedRoute.snapshot.paramMap.get("listType");
    // Dynamic Meta Tags
    const isUserList = this.listType === "user";
    const title = isUserList ? "Users | ASCENDynamics NFP" : "Organizations | ASCENDynamics NFP";
    const description = isUserList ? "Explore a diverse list of users contributing to the ASCENDynamics NFP community." : "Discover organizations making an impact through volunteering and community efforts on ASCENDynamics NFP.";
    const keywords = isUserList ? "users, profiles, volunteer" : "organizations, nonprofits, community";
    this.metaService.updateMetaTags(title, description, keywords, {
      title: title,
      description: description,
      url: `https://app.ASCENDynamics.org/account/${this.accountId}/related/${this.listType}`,
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    }, {
      card: "summary_large_image",
      title: title,
      description: description,
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    });
  }
  /**
   * Updates the status of a related account.
   * @param request The related account request to update.
   * @param status The new status to set.
   */
  updateStatus(request, status) {
    this.currentUser$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.take)(1)).subscribe(authUser => {
      if (!(authUser !== null && authUser !== void 0 && authUser.uid) || !request.id) {
        console.error("User ID or Account ID is missing");
        return;
      }
      if (!this.accountId || !request.id) return;
      const updatedRelatedAccount = {
        id: request.id,
        accountId: request.accountId || this.accountId,
        status: status,
        lastModifiedBy: authUser.uid
      };
      // Dispatch an action to update the related account's status
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.updateRelatedAccount({
        accountId: this.accountId,
        relatedAccount: updatedRelatedAccount
      }));
    });
  }
  /**
   * Accepts a related account request.
   * @param request The related account request to accept.
   */
  acceptRequest(request) {
    this.updateStatus(request, "accepted");
  }
  /**
   * Rejects a related account request.
   * @param request The related account request to reject.
   */
  rejectRequest(request) {
    this.updateStatus(request, "rejected");
  }
  /**
   * Removes a related account request.
   * @param request The related account request to remove.
   */
  removeRequest(request) {
    if (!this.accountId || !request.id) return;
    // Dispatch an action to delete the related account
    this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.deleteRelatedAccount({
      accountId: this.accountId,
      relatedAccountId: request.id
    }));
  }
  /**
   * Determines whether to show accept/reject buttons for a related account.
   * @param request The related account request.
   * @returns An observable emitting a boolean.
   */
  showAcceptRejectButtons(request) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.combineLatest)([this.isOwner$, this.currentUser$]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.map)(([isOwner, currentUser]) => isOwner && request.status === "pending" && request.initiatorId !== (currentUser === null || currentUser === void 0 ? void 0 : currentUser.uid)));
  }
  /**
   * Determines whether to show the remove button for a related account.
   * @param request The related account request.
   * @returns An observable emitting a boolean.
   */
  showRemoveButton(request) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.combineLatest)([this.isOwner$, this.currentUser$]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.map)(([isOwner, currentUser]) => isOwner && (request.status === "accepted" || request.status === "pending" && request.initiatorId === (currentUser === null || currentUser === void 0 ? void 0 : currentUser.uid))));
  }
  /**
   * Helper method to determine the other account ID in a related account.
   * @param relatedAccount The related account object.
   * @returns The ID of the other account or null if not found.
   */
  getOtherId(relatedAccount) {
    if (!this.accountId) return null;
    if (relatedAccount.initiatorId && relatedAccount.initiatorId !== this.accountId) {
      return relatedAccount.initiatorId;
    }
    if (relatedAccount.targetId && relatedAccount.targetId !== this.accountId) {
      return relatedAccount.targetId;
    }
    return null;
  }
  /**
   * TrackBy function to optimize *ngFor rendering.
   * @param index The index of the item.
   * @param item The related account item.
   * @returns The unique identifier for the item.
   */
  trackById(index, item) {
    return item.id ? item.id : index.toString();
  }
}
_ListPage = ListPage;
_ListPage.ɵfac = function ListPage_Factory(t) {
  return new (t || _ListPage)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_10__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_core_services_meta_service__WEBPACK_IMPORTED_MODULE_3__.MetaService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_11__.Store));
};
_ListPage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({
  type: _ListPage,
  selectors: [["app-list"]],
  decls: 20,
  vars: 19,
  consts: [[3, "defaultHref", "title", 4, "ngIf"], [3, "fullscreen"], [4, "ngIf"], [3, "defaultHref", "title"], ["button", "", 3, "routerLink", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["button", "", 3, "routerLink"], ["slot", "start"], [3, "alt", "src", 4, "ngIf"], ["slot", "end", "expand", "block", "color", "secondary", 3, "click", 4, "ngIf"], [3, "alt", "src"], ["slot", "end", "expand", "block", "color", "secondary", 3, "click"], ["slot", "end", "expand", "block", 3, "click", 4, "ngIf"], ["slot", "end", "expand", "block", 3, "click"]],
  template: function ListPage_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-header");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](1, ListPage_app_header_1_Template, 1, 2, "app-header", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "ion-content", 1)(4, "ion-grid")(5, "ion-row")(6, "ion-col")(7, "ion-card")(8, "ion-card-header")(9, "ion-card-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](10);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](11, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](12, "ion-card-subtitle");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](13);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](14, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](15, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](16, ListPage_ng_container_16_Template, 3, 2, "ng-container", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](17, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](18, ListPage_ng_container_18_Template, 3, 3, "ng-container", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](19, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()();
    }
    if (rf & 2) {
      let tmp_3_0;
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 7, ctx.account$));
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("fullscreen", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](7);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](11, 9, ctx.title$));
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate2"](" ", (tmp_3_0 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](14, 11, ctx.currentRelatedAccountsList$)) == null ? null : tmp_3_0.length, " ", (tmp_3_0 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](15, 13, ctx.title$)) == null ? null : tmp_3_0.toLowerCase(), " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](17, 15, ctx.currentRelatedAccountsList$));
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](19, 17, ctx.isOwner$));
    }
  },
  dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonCard, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonCardHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonCardSubtitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonCardTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonList, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonThumbnail, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.RouterLinkDelegate, _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_4__.AppHeaderComponent, _angular_common__WEBPACK_IMPORTED_MODULE_12__.AsyncPipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3JlbGF0ZWRBY2NvdW50L3BhZ2VzL2xpc3QvbGlzdC5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 3492:
/*!*******************************************************************************************!*\
  !*** ./src/app/modules/account/relatedListings/pages/listings-list/listings-list.page.ts ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ListingsListPage: () => (/* binding */ ListingsListPage)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 5536);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ 1640);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 3901);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs/operators */ 4406);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs/operators */ 5117);
/* harmony import */ var _state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../state/selectors/account.selectors */ 8686);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../state/actions/account.actions */ 8314);
/* harmony import */ var _state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../state/actions/listings.actions */ 7118);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _core_services_meta_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../core/services/meta.service */ 6369);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../shared/components/app-header/app-header.component */ 8245);
/* harmony import */ var _shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../shared/components/pagination/pagination.component */ 4815);

var _ListingsListPage;















const _c0 = a0 => ["/listings", a0, "applicants"];
function ListingsListPage_ion_list_25_ion_item_1_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "img", 26);
  }
  if (rf & 2) {
    const listing_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("src", listing_r2.iconImage, _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsanitizeUrl"])("alt", listing_r2.title);
  }
}
function ListingsListPage_ion_list_25_ion_item_1_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "div", 27);
  }
}
function ListingsListPage_ion_list_25_ion_item_1_ion_button_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "ion-button", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function ListingsListPage_ion_list_25_ion_item_1_ion_button_16_Template_ion_button_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"]($event.stopPropagation());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](1, "ion-icon", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](2, " View Applicants ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const listing_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpureFunction1"](1, _c0, listing_r2.id));
  }
}
function ListingsListPage_ion_list_25_ion_item_1_ion_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "ion-button", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function ListingsListPage_ion_list_25_ion_item_1_ion_button_19_Template_ion_button_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r5);
      const listing_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
      ctx_r2.deleteListing(listing_r2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"]($event.stopPropagation());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](1, "ion-icon", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](2, " DELETE Listing ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
}
function ListingsListPage_ion_list_25_ion_item_1_ion_button_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "ion-button", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function ListingsListPage_ion_list_25_ion_item_1_ion_button_22_Template_ion_button_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r6);
      const listing_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
      ctx_r2.removeRelatedListing(listing_r2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"]($event.stopPropagation());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](1, "ion-icon", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](2, " Remove Application ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
}
function ListingsListPage_ion_list_25_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "ion-item", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function ListingsListPage_ion_list_25_ion_item_1_Template_ion_item_click_0_listener() {
      const listing_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r1).$implicit;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r2.goToListing(listing_r2.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](1, "ion-thumbnail", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](2, ListingsListPage_ion_list_25_ion_item_1_img_2_Template, 1, 2, "img", 18)(3, ListingsListPage_ion_list_25_ion_item_1_div_3_Template, 1, 0, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](4, "ion-label")(5, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](7, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](9, "div", 20)(10, "ion-badge", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](12, "ion-badge", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](14, "ion-badge", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](16, ListingsListPage_ion_list_25_ion_item_1_ion_button_16_Template, 3, 3, "ion-button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](17, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](18, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](19, ListingsListPage_ion_list_25_ion_item_1_ion_button_19_Template, 3, 0, "ion-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](20, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](21, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](22, ListingsListPage_ion_list_25_ion_item_1_ion_button_22_Template, 3, 0, "ion-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](23, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_12_0;
    let tmp_13_0;
    const listing_r2 = ctx.$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", listing_r2.iconImage);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !listing_r2.iconImage);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](listing_r2.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](listing_r2.organization);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](listing_r2.type);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("color", listing_r2.status === "active" ? "success" : "warning");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", listing_r2.status, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](listing_r2.relationship);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](17, 11, ctx_r2.isOwner$) && listing_r2.relationship === "owner" && listing_r2.accountId === ((tmp_12_0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](18, 13, ctx_r2.currentUser$)) == null ? null : tmp_12_0.uid));
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](20, 15, ctx_r2.isOwner$) && listing_r2.relationship === "owner" && listing_r2.accountId === ((tmp_13_0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](21, 17, ctx_r2.currentUser$)) == null ? null : tmp_13_0.uid));
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](23, 19, ctx_r2.isOwner$) && listing_r2.relationship !== "owner");
  }
}
function ListingsListPage_ion_list_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "ion-list");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, ListingsListPage_ion_list_25_ion_item_1_Template, 24, 21, "ion-item", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const listings_r7 = ctx.ngIf;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngForOf", listings_r7)("ngForTrackBy", ctx_r2.trackById);
  }
}
function ListingsListPage_ion_fab_27_ion_fab_button_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "ion-fab-button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](1, "ion-icon", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
}
function ListingsListPage_ion_fab_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "ion-fab", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, ListingsListPage_ion_fab_27_ion_fab_button_1_Template, 2, 0, "ion-fab-button", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](2, 1, ctx_r2.isOwner$));
  }
}
class ListingsListPage {
  constructor(activatedRoute, alertController, metaService, router, store) {
    this.activatedRoute = activatedRoute;
    this.alertController = alertController;
    this.metaService = metaService;
    this.router = router;
    this.store = store;
    this.accountId = null;
    this.title = "Listings";
    this.relationshipFilter$ = new rxjs__WEBPACK_IMPORTED_MODULE_9__.BehaviorSubject("all");
    this.relationshipFilter = "all";
    // Pagination State
    this.pageSize = 10; // Number of listings per page
    this.currentPageSubject = new rxjs__WEBPACK_IMPORTED_MODULE_9__.BehaviorSubject(1);
    this.currentPage$ = this.currentPageSubject.asObservable();
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");
  }
  ngOnInit() {
    this.currentUser$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_2__.selectAuthUser);
    if (this.accountId) {
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_3__.loadAccount({
        accountId: this.accountId
      }));
      this.account$ = this.store.select((0,_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAccountById)(this.accountId));
      this.relatedListings$ = this.store.select((0,_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_1__.selectRelatedListingsByAccountId)(this.accountId));
      this.isOwner$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.combineLatest)([this.currentUser$, (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(this.accountId)]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.map)(([currentUser, accountId]) => (currentUser === null || currentUser === void 0 ? void 0 : currentUser.uid) === accountId));
      this.account$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.take)(1)).subscribe(account => {
        if (account) {
          this.title = account.type === "user" ? "My Listings" : "Group Listings";
        }
      });
      this.filteredRelatedListings$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.combineLatest)([this.relatedListings$, this.relationshipFilter$, this.isOwner$]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.map)(([listings, filter, isOwner]) => {
        let filteredListings = isOwner ? listings : listings.filter(listing => listing.status === "active");
        return filter === "all" ? filteredListings : filteredListings.filter(listing => listing.relationship === filter);
      }));
      // Pagination Logic
      this.totalItems$ = this.filteredRelatedListings$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.map)(listings => listings.length));
      this.totalPages$ = this.totalItems$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.map)(totalItems => Math.ceil(totalItems / this.pageSize)));
      this.paginatedListings$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.combineLatest)([this.filteredRelatedListings$, this.currentPage$]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.map)(([listings, currentPage]) => {
        const startIndex = (currentPage - 1) * this.pageSize;
        return listings.slice(startIndex, startIndex + this.pageSize);
      }));
      this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_3__.loadRelatedListings({
        accountId: this.accountId
      }));
    }
  }
  ionViewWillEnter() {
    this.metaService.updateMetaTags("Volunteer Listings | ASCENDynamics NFP", "Explore volunteering opportunities available on ASCENDynamics NFP to make an impact in your community.", "volunteer listings, nonprofits, opportunities, community impact", {
      title: "Volunteer Listings | ASCENDynamics NFP",
      description: "Browse and apply for volunteer roles on ASCENDynamics NFP.",
      url: "https://app.ASCENDynamics.org/listings",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    }, {
      card: "summary",
      title: "Volunteer Listings | ASCENDynamics NFP",
      description: "Find opportunities to contribute and grow your skills with ASCENDynamics NFP.",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    });
  }
  /**
   * Removes a related listing.
   * @param listing The related listing to remove.
   */
  removeRelatedListing(listing) {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const alert = yield _this.alertController.create({
        header: "Confirm Removal",
        message: listing.relationship === "owner" ? "Are you sure you want to delete this listing?" : "Are you sure you want to remove your application?",
        buttons: [{
          text: "Cancel",
          role: "cancel"
        }, {
          text: "Remove",
          role: "destructive",
          handler: () => {
            if (_this.accountId && listing.id) {
              _this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_3__.deleteRelatedListing({
                accountId: _this.accountId,
                relatedListingId: listing.id
              }));
            }
          }
        }]
      });
      yield alert.present();
    })();
  }
  deleteListing(listing) {
    var _this2 = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const alert = yield _this2.alertController.create({
        header: "Confirm Deletion",
        message: "Are you sure you want to delete this listing?",
        buttons: [{
          text: "Cancel",
          role: "cancel"
        }, {
          text: "Delete",
          role: "destructive",
          handler: () => {
            if (listing.id) {
              _this2.store.dispatch(_state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_4__.deleteListing({
                id: listing.id
              }));
            }
          }
        }]
      });
      yield alert.present();
    })();
  }
  /**
   * TrackBy function to optimize *ngFor rendering.
   * @param index The index of the item.
   * @param item The related listing item.
   * @returns The unique identifier for the item.
   */
  trackById(index, item) {
    return item.id;
  }
  /**
   * Navigates to the listing details page.
   * @param listingId The ID of the listing.
   */
  goToListing(listingId) {
    if (listingId) {
      this.router.navigate([`/listings/${listingId}`]);
    } else {
      console.error("Invalid listing ID");
    }
  }
  /**
   * Handles changes in the relationship filter.
   * @param event The event containing the new filter value.
   */
  onRelationshipFilterChange(event) {
    this.relationshipFilter$.next(event.detail.value);
  }
  goToPage(pageNumber) {
    this.currentPageSubject.next(pageNumber);
  }
}
_ListingsListPage = ListingsListPage;
_ListingsListPage.ɵfac = function ListingsListPage_Factory(t) {
  return new (t || _ListingsListPage)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_14__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_15__.AlertController), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_core_services_meta_service__WEBPACK_IMPORTED_MODULE_5__.MetaService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_14__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_16__.Store));
};
_ListingsListPage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineComponent"]({
  type: _ListingsListPage,
  selectors: [["app-listings-list"]],
  decls: 31,
  vars: 14,
  consts: [[3, "title", "defaultHref"], ["scrollable", "", 3, "ngModelChange", "ionChange", "ngModel"], ["value", "all"], ["name", "list-outline"], ["value", "owner"], ["name", "person-outline"], ["value", "applicant"], ["name", "paper-plane-outline"], ["value", "participant"], ["name", "people-outline"], ["value", "saved"], ["name", "bookmark-outline"], [4, "ngIf"], ["vertical", "bottom", "horizontal", "end", "slot", "fixed", 4, "ngIf"], [3, "pageChange", "totalItems", "pageSize", "maxVisiblePages"], ["button", "", 3, "click", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["button", "", 3, "click"], ["slot", "start"], [3, "src", "alt", 4, "ngIf"], ["class", "placeholder-thumbnail", 4, "ngIf"], [1, "ion-padding-vertical"], ["color", "primary", 1, "ion-margin-end"], [1, "ion-margin-end", 3, "color"], ["color", "tertiary"], ["slot", "end", "color", "primary", 3, "routerLink", "click", 4, "ngIf"], ["slot", "end", "color", "danger", 3, "click", 4, "ngIf"], [3, "src", "alt"], [1, "placeholder-thumbnail"], ["slot", "end", "color", "primary", 3, "click", "routerLink"], ["name", "people-outline", "slot", "start"], ["slot", "end", "color", "danger", 3, "click"], ["name", "trash-outline", "slot", "start"], ["name", "close-circle-outline", "slot", "start"], ["vertical", "bottom", "horizontal", "end", "slot", "fixed"], ["routerLink", "/listings/create", 4, "ngIf"], ["routerLink", "/listings/create"], ["name", "add"]],
  template: function ListingsListPage_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "ion-header");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](1, "app-header", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](2, "ion-toolbar")(3, "ion-segment", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtwoWayListener"]("ngModelChange", function ListingsListPage_Template_ion_segment_ngModelChange_3_listener($event) {
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtwoWayBindingSet"](ctx.relationshipFilter, $event) || (ctx.relationshipFilter = $event);
        return $event;
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("ionChange", function ListingsListPage_Template_ion_segment_ionChange_3_listener($event) {
        return ctx.onRelationshipFilterChange($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](4, "ion-segment-button", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](5, "ion-icon", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](6, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](7, "All");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](8, "ion-segment-button", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](9, "ion-icon", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](10, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](11, "My Listings");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](12, "ion-segment-button", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](13, "ion-icon", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](14, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](15, "Applications");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](16, "ion-segment-button", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](17, "ion-icon", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](18, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](19, "Participating");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](20, "ion-segment-button", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](21, "ion-icon", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](22, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](23, "Saved");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](24, "ion-content");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](25, ListingsListPage_ion_list_25_Template, 2, 2, "ion-list", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](26, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](27, ListingsListPage_ion_fab_27_Template, 3, 3, "ion-fab", 13);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](28, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](29, "app-pagination", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](30, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("pageChange", function ListingsListPage_Template_app_pagination_pageChange_29_listener($event) {
        return ctx.goToPage($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      let tmp_5_0;
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("title", ctx.title)("defaultHref", "account/" + ctx.accountId);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtwoWayProperty"]("ngModel", ctx.relationshipFilter);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](22);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](26, 8, ctx.paginatedListings$));
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](28, 10, ctx.currentUser$));
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("totalItems", ((tmp_5_0 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](30, 12, ctx.filteredRelatedListings$)) == null ? null : tmp_5_0.length) || 0)("pageSize", ctx.pageSize)("maxVisiblePages", 5);
    }
  },
  dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_14__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_17__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_17__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_18__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_18__.NgModel, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonBadge, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonFab, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonFabButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonList, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonSegment, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonSegmentButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonThumbnail, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.IonToolbar, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.SelectValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_15__.RouterLinkDelegate, _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_6__.AppHeaderComponent, _shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_7__.PaginationComponent, _angular_common__WEBPACK_IMPORTED_MODULE_17__.AsyncPipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nion-segment[_ngcontent-%COMP%] {\n  --padding-top: 0;\n  --padding-bottom: 0;\n  --padding-start: 0;\n  --padding-end: 0;\n  --indicator-height: 2px;\n  overflow-x: auto;\n}\n\nion-segment-button[_ngcontent-%COMP%] {\n  --padding: 6px 8px;\n  --min-width: auto;\n  flex: 0 0 auto;\n}\n\nion-segment-button[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n\nion-segment-button[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%] {\n  font-size: 12px;\n}\n\n@media (max-width: 576px) {\n  ion-segment-button[_ngcontent-%COMP%] {\n    --padding: 4px 6px;\n  }\n  ion-segment-button[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%] {\n    display: none; \n\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L3JlbGF0ZWRMaXN0aW5ncy9wYWdlcy9saXN0aW5ncy1saXN0L2xpc3RpbmdzLWxpc3QucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0ZBQUE7QUFtQkE7RUFDRSxnQkFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLHVCQUFBO0VBQ0EsZ0JBQUE7QUFDRjs7QUFFQTtFQUNFLGtCQUFBO0VBQ0EsaUJBQUE7RUFDQSxjQUFBO0FBQ0Y7O0FBRUE7RUFDRSxlQUFBO0FBQ0Y7O0FBRUE7RUFDRSxlQUFBO0FBQ0Y7O0FBRUE7RUFDRTtJQUNFLGtCQUFBO0VBQ0Y7RUFFQTtJQUNFLGFBQUEsRUFBQSxzQ0FBQTtFQUFGO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtOiBBbGxvd2luZyBVc2VycyBhbmQgT3JnYW5pemF0aW9ucyB0byBDb2xsYWJvcmF0ZS5cbiogQ29weXJpZ2h0IChDKSAyMDIzICBBU0NFTkR5bmFtaWNzIE5GUFxuKlxuKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uXG4qXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4qIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZFxuKiBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4qIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4qIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuKiBhbG9uZyB3aXRoIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmlvbi1zZWdtZW50IHtcbiAgLS1wYWRkaW5nLXRvcDogMDtcbiAgLS1wYWRkaW5nLWJvdHRvbTogMDtcbiAgLS1wYWRkaW5nLXN0YXJ0OiAwO1xuICAtLXBhZGRpbmctZW5kOiAwO1xuICAtLWluZGljYXRvci1oZWlnaHQ6IDJweDtcbiAgb3ZlcmZsb3cteDogYXV0bztcbn1cblxuaW9uLXNlZ21lbnQtYnV0dG9uIHtcbiAgLS1wYWRkaW5nOiA2cHggOHB4O1xuICAtLW1pbi13aWR0aDogYXV0bztcbiAgZmxleDogMCAwIGF1dG87XG59XG5cbmlvbi1zZWdtZW50LWJ1dHRvbiBpb24taWNvbiB7XG4gIGZvbnQtc2l6ZTogMTZweDtcbn1cblxuaW9uLXNlZ21lbnQtYnV0dG9uIGlvbi1sYWJlbCB7XG4gIGZvbnQtc2l6ZTogMTJweDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDU3NnB4KSB7XG4gIGlvbi1zZWdtZW50LWJ1dHRvbiB7XG4gICAgLS1wYWRkaW5nOiA0cHggNnB4O1xuICB9XG5cbiAgaW9uLXNlZ21lbnQtYnV0dG9uIGlvbi1sYWJlbCB7XG4gICAgZGlzcGxheTogbm9uZTsgLyogSGlkZSBsYWJlbHMgb24gdmVyeSBzbWFsbCBzY3JlZW5zICovXG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ })

}]);
//# sourceMappingURL=src_app_modules_account_account_module_ts.js.map