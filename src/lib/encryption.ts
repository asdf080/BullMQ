import crypto from "crypto";

// 환경변수에서 암호화 키 가져오기 (32바이트 = 256비트)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-32-character-secret-key!!!!";

/**
 * 단일 필드 암호화
 * @param plaintext 암호화할 평문
 * @returns 암호화된 문자열 (IV:encrypted:authTag 형태)
 */
export function encryptField(plaintext: string): string {
  try {
    // 랜덤 IV 생성 (16바이트)
    const iv = crypto.randomBytes(16);

    // AES-256-GCM 암호화 객체 생성
    const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
    cipher.setAutoPadding(true);

    // 암호화 실행
    let encrypted = cipher.update(plaintext, "utf8", "hex");
    encrypted += cipher.final("hex");

    // 인증 태그 가져오기 (데이터 무결성 검증용)
    const authTag = cipher.getAuthTag();

    // IV:encrypted:authTag 형태로 결합
    return `${iv.toString("hex")}:${encrypted}:${authTag.toString("hex")}`;
  } catch (error) {
    console.error("암호화 실패:", error);
    throw new Error(`암호화 실패: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * 단일 필드 복호화
 * @param encryptedData 암호화된 데이터 (IV:encrypted:authTag 형태)
 * @returns 복호화된 평문
 */
export function decryptField(encryptedData: string): string {
  try {
    // 암호화된 데이터 분리
    const parts = encryptedData.split(":");
    if (parts.length !== 3) {
      throw new Error("잘못된 암호화 데이터 형식");
    }

    const [ivHex, encrypted, authTagHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    // AES-256-GCM 복호화 객체 생성
    const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);

    // 복호화 실행
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("복호화 실패:", error);
    throw new Error(`복호화 실패: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * 고객 데이터 전체 암호화
 * @param customer 고객 데이터 객체
 * @returns 암호화된 고객 데이터
 */
export function encryptCustomerData(customer: any): any {
  try {
    // 암호화할 필드들
    const fieldsToEncrypt = ["name", "email", "phone", "ssn_last4", "address"];

    // 새 객체 생성 (원본 변경 방지)
    const encryptedCustomer = { ...customer };

    // 각 필드 암호화
    fieldsToEncrypt.forEach((field) => {
      if (customer[field]) {
        encryptedCustomer[field] = encryptField(customer[field]);
      }
    });

    // 암호화 완료 표시
    encryptedCustomer.encrypted = true;
    encryptedCustomer.encryptedAt = new Date().toISOString();
    return encryptedCustomer;
  } catch (error) {
    console.error(`❌ 고객 ${customer.id} 암호화 실패:`, error);
    throw error;
  }
}

/**
 * 고객 데이터 전체 복호화
 * @param encryptedCustomer 암호화된 고객 데이터
 * @returns 복호화된 고객 데이터
 */
export function decryptCustomerData(encryptedCustomer: any): any {
  try {
    // 복호화할 필드들
    const fieldsToDecrypt = ["name", "email", "phone", "ssnLast4", "address"];

    // 새 객체 생성
    const decryptedCustomer = { ...encryptedCustomer };

    // 각 필드 복호화
    fieldsToDecrypt.forEach((field) => {
      if (encryptedCustomer[field] && typeof encryptedCustomer[field] === "string") {
        // 이미 암호화된 데이터인지 확인 (콜론 포함 여부로 판단)
        if (encryptedCustomer[field].includes(":")) {
          decryptedCustomer[field] = decryptField(encryptedCustomer[field]);
        }
      }
    });

    // 암호화 상태 정보 제거
    decryptedCustomer.encrypted = false;

    return decryptedCustomer;
  } catch (error) {
    console.error(`❌ 고객 ${encryptedCustomer.id} 복호화 실패:`, error);
    throw error;
  }
}

/**
 * 배치 단위 고객 데이터 암호화
 * @param customers 고객 배열 (보통 100명)
 * @returns 암호화된 고객 배열
 */
export async function encryptCustomerBatch(customers: any[]): Promise<any[]> {
  const encryptedCustomers = [];
  let successCount = 0;
  let failCount = 0;

  for (const customer of customers) {
    try {
      const encrypted = encryptCustomerData(customer);
      encryptedCustomers.push(encrypted);
      successCount++;

      // CPU 부하 제한을 위한 잠깐 대기
      await new Promise((resolve) => setTimeout(resolve, 10));
    } catch (error) {
      console.error(`고객 ${customer.id} 암호화 실패:`, error);
      // 실패한 경우 원본 데이터 유지
      encryptedCustomers.push({
        ...customer,
        encryptionError: error instanceof Error ? error.message : "Unknown error",
        encrypted: false,
      });
      failCount++;
    }
  }

  console.log(`✅ 배치 암호화 완료: 성공 ${successCount}명, 실패 ${failCount}명`);

  return encryptedCustomers;
}

/**
 * 암호화 키 검증 함수
 */
export function validateEncryptionKey(): boolean {
  try {
    const testData = "test-encryption-key-validation";
    const encrypted = encryptField(testData);
    const decrypted = decryptField(encrypted);
    return decrypted === testData;
  } catch (error) {
    console.error("암호화 키 검증 실패:", error);
    return false;
  }
}

// 모듈 초기화 시 키 검증
if (!validateEncryptionKey()) {
  throw new Error("암호화 키가 올바르지 않습니다. ENCRYPTION_KEY 환경변수를 확인하세요.");
}
