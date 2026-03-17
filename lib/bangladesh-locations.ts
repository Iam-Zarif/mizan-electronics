export type LocationOption = {
  id: string;
  name: string;
  bnName: string;
};

type DhakaDistrictItem = {
  district?: string;
  districtbn?: string;
  upazilla?: string[];
};

type DhakaDivisionResponse = {
  data?: DhakaDistrictItem[];
};

const DHAKA_DIVISION_NAME = "Dhaka";
const DHAKA_DIVISION_BN_NAME = "ঢাকা";
const DHAKA_DIVISION_ENDPOINT = "https://bdapis.com/api/v1.2/division/Dhaka";

const DHAKA_CITY_AREAS = [
  "Dhaka North City",
  "Dhaka South City",
  "Uttara",
  "Mirpur",
  "Mohammadpur",
  "Dhanmondi",
  "Gulshan",
  "Banani",
  "Badda",
  "Rampura",
  "Bashundhara",
  "Pallabi",
  "Mohakhali",
  "Tejgaon",
  "Malibagh",
  "Shantinagar",
  "Paltan",
  "Wari",
  "Old Dhaka",
  "Khilgaon",
  "Shyamoli",
  "Adabor",
  "Jatrabari",
  "Demra",
];

let dhakaDivisionCache: Promise<DhakaDistrictItem[]> | null = null;

const getDhakaDivisionData = async () => {
  if (!dhakaDivisionCache) {
    dhakaDivisionCache = fetch(DHAKA_DIVISION_ENDPOINT, {
      cache: "force-cache",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load Dhaka division locations");
        }

        const payload = (await response.json()) as DhakaDivisionResponse;
        return Array.isArray(payload.data) ? payload.data : [];
      })
      .catch((error) => {
        dhakaDivisionCache = null;
        throw error;
      });
  }

  return dhakaDivisionCache;
};

const toDistrictOption = (item: DhakaDistrictItem): LocationOption => ({
  id: String(item.district ?? ""),
  name: String(item.district ?? ""),
  bnName: String(item.districtbn ?? item.district ?? ""),
});

const toAreaOption = (districtName: string, areaName: string): LocationOption => ({
  id: `${districtName}:${areaName}`,
  name: areaName,
  bnName: areaName,
});

export const getDhakaDivision = async (): Promise<LocationOption> => ({
  id: DHAKA_DIVISION_NAME,
  name: DHAKA_DIVISION_NAME,
  bnName: DHAKA_DIVISION_BN_NAME,
});

export const getDhakaDistricts = async () => {
  const data = await getDhakaDivisionData();
  return data.map(toDistrictOption);
};

export const getDhakaAreas = async (districtName: string) => {
  if (districtName === "Dhaka") {
    return DHAKA_CITY_AREAS.map((area) => toAreaOption(districtName, area));
  }

  const data = await getDhakaDivisionData();
  const district = data.find(
    (item) =>
      item.district === districtName ||
      item.districtbn === districtName,
  );

  if (!district || !Array.isArray(district.upazilla)) {
    return [];
  }

  return district.upazilla.map((area) => toAreaOption(String(district.district ?? ""), area));
};
