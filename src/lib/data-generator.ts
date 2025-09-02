import { Customer } from "@/generated/prisma";
import { faker } from "@faker-js/faker";

// 고객 데이터 인터페이스
export type CustomerData = Omit<Customer, "createdAt" | "updatedAt" | "encryptedAt">;

// 한국 이름 생성을 위한 성씨와 이름 데이터
const koreanLastNames = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안", "송", "류", "전"];

const koreanFirstNames = ["민준", "서준", "도윤", "시우", "주원", "하준", "지호", "지후", "준서", "건우", "서연", "서윤", "지우", "서현", "예은", "하은", "윤서", "지유", "채원", "지원"];

// 한국 전화번호 생성
function generateKoreanPhone(): string {
  const prefixes = ["010", "011", "016", "017", "018", "019"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const middle = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  const last = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  return `${prefix}-${middle}-${last}`;
}

// 한국 이름 생성
function generateKoreanName(): string {
  const lastName = koreanLastNames[Math.floor(Math.random() * koreanLastNames.length)];
  const firstName = koreanFirstNames[Math.floor(Math.random() * koreanFirstNames.length)];
  return lastName + firstName;
}

// 주민번호 뒷자리 생성 (암호화 대상)
function generateSSNLast4(): string {
  // 성별코드(1-4) + 3자리 랜덤
  const genderCode = Math.floor(Math.random() * 4) + 1;
  const randomDigits = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${genderCode}${randomDigits}`;
}

// 한국 주소 생성
function generateKoreanAddress(): string {
  const cities = ["서울시", "부산시", "대구시", "인천시", "광주시", "대전시", "울산시"];
  const districts = ["강남구", "서초구", "송파구", "강동구", "마포구", "용산구", "종로구"];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const district = districts[Math.floor(Math.random() * districts.length)];
  const street = faker.location.street();
  const building = Math.floor(Math.random() * 999) + 1;

  return `${city} ${district} ${street} ${building}번길`;
}

// 고객 데이터 생성 함수
function generateCustomerData(id: number): CustomerData {
  const isKorean = Math.random() > 0.3; // 70% 한국인, 30% 외국인

  return {
    id: `CUST${id.toString().padStart(6, "0")}`,
    name: isKorean ? generateKoreanName() : faker.person.fullName(),
    email: faker.internet.email(),
    phone: isKorean ? generateKoreanPhone() : faker.phone.number(),
    ssnLast4: generateSSNLast4(),
    address: isKorean ? generateKoreanAddress() : faker.location.streetAddress(),
    birthDate: faker.date.between({
      from: "1950-01-01",
      to: "2005-12-31",
    }),
    joinDate: faker.date.between({
      from: "2020-01-01",
      to: "2024-12-31",
    }),
    accountBalance: Math.floor(Math.random() * 10000000), // 0 ~ 1000만원
    isVip: Math.random() > 0.85, // 15% VIP 고객
    encrypted: false,
  };
}

// 대용량 고객 데이터 생성
function generateBulkCustomerData(count: number = 20000): CustomerData[] {
  console.log(`🏭 ${count}명의 고객 데이터 생성 중...`);

  const customers: CustomerData[] = [];
  const startTime = Date.now();

  for (let i = 1; i <= count; i++) {
    customers.push(generateCustomerData(i));

    // 진행률 표시
    if (i % 2000 === 0) {
      console.log(`📊 진행률: ${((i / count) * 100).toFixed(1)}% (${i}/${count})`);
    }
  }

  const endTime = Date.now();
  console.log(`✅ 데이터 생성 완료! 소요시간: ${endTime - startTime}ms`);

  return customers;
}

export { generateCustomerData, generateBulkCustomerData };
