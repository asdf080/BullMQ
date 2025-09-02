import { generateBulkCustomerData } from "@/lib/data-generator";
import { prisma } from "@/lib/prisma";

// 메인 실행 함수
async function main() {
  console.log("🏦 SecureBank 고객 데이터 생성기 v1.0");
  console.log("📋 개인정보보호법 대응을 위한 암호화 대상 데이터 생성\n");

  try {
    // 1. 대용량 고객 데이터 생성
    const customerData = generateBulkCustomerData(20000);

    // 2. db에 저장
    await prisma.customer.createMany({
      data: customerData,
    });
    console.log(`✅ ${customerData.length}개 고객 데이터가 DB에 저장되었습니다.`);
  } catch (error) {
    console.error("❌ 데이터 생성 중 오류 발생:", error);
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}
