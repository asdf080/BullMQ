import { CustomerData, generateBulkCustomerData, saveCustomerData } from "@/lib/data-generator";

// 샘플 데이터 미리보기
function previewData(customers: CustomerData[], count: number = 3): void {
  console.log("\n📋 생성된 데이터 미리보기:");
  console.log("=".repeat(80));

  customers.slice(0, count).forEach((customer, index) => {
    console.log(`\n고객 #${index + 1}:`);
    console.log(`  ID: ${customer.id}`);
    console.log(`  이름: ${customer.name}`);
    console.log(`  이메일: ${customer.email}`);
    console.log(`  전화번호: ${customer.phone}`);
    console.log(`  주민번호 뒷자리: ${customer.ssn_last4} (🔒 암호화 대상)`);
    console.log(`  주소: ${customer.address}`);
    console.log(`  생년월일: ${customer.birthDate}`);
    console.log(`  가입일: ${customer.joinDate}`);
    console.log(`  계좌잔액: ${customer.accountBalance.toLocaleString()}원`);
    console.log(`  VIP 여부: ${customer.isVip ? "⭐ VIP" : "일반"}`);
  });

  console.log("=".repeat(80));
}

// 메인 실행 함수
function main() {
  console.log("🏦 SecureBank 고객 데이터 생성기 v1.0");
  console.log("📋 개인정보보호법 대응을 위한 암호화 대상 데이터 생성\n");

  try {
    // 1. 대용량 고객 데이터 생성
    const customerData = generateBulkCustomerData(20000);

    // 2. 샘플 데이터 미리보기
    // previewData(customerData);

    // 3. 통계 정보 출력
    const vipCount = customerData.filter((c) => c.isVip).length;
    const avgBalance = customerData.reduce((sum, c) => sum + c.accountBalance, 0) / customerData.length;

    console.log("\n📊 데이터 통계:");
    console.log(`  총 고객 수: ${customerData.length.toLocaleString()}명`);
    console.log(`  VIP 고객 수: ${vipCount.toLocaleString()}명 (${((vipCount / customerData.length) * 100).toFixed(1)}%)`);
    console.log(`  평균 계좌잔액: ${Math.floor(avgBalance).toLocaleString()}원`);

    // 4. 파일로 저장
    saveCustomerData(customerData);
    // console.log("~~ TODO ~~");
    // console.log("\n🚀 다음 단계: BullMQ를 사용한 배치 암호화 처리");
    // console.log("   - 100개씩 200개 작업으로 분할");
    // console.log("   - CPU 사용률 50% 제한");
    // console.log("   - 암호화 대상: name, email, phone, ssn_last4, address");
  } catch (error) {
    console.error("❌ 데이터 생성 중 오류 발생:", error);
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}
