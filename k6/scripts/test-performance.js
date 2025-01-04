import { check, sleep } from "k6";
import http from "k6/http";
import { Trend } from "k6/metrics";

// 트렌드(메트릭) 정의 예시
const dataReceivedTrend = new Trend("data_received_size", true);

// k6 옵션(시나리오) 설정
// export const options = {
//     scenarios: {
//         // 1) ramp_up 시나리오
//         ramp_up: {
//             executor: "ramping-arrival-rate",
//             startRate: 100, // 초당 100 요청으로 시작
//             timeUnit: "1s",
//             preAllocatedVUs: 200, // 초기 VU 수
//             maxVUs: 1000, // 최대 VU 수
//             stages: [
//                 { target: 1000, duration: "1m" }, // 1분 동안 100 → 1000 RPS 상승
//             ],
//             gracefulStop: "0s",
//         },

//         // 2) steady_state 시나리오
//         steady_state: {
//             executor: "constant-arrival-rate",
//             rate: 1000, // 초당 1000 요청
//             timeUnit: "1s",
//             duration: "2m", // 2분 동안 유지
//             startTime: "1m", // ramp_up 시나리오 종료(1분) 후 시작
//             preAllocatedVUs: 1000,
//             maxVUs: 1500,
//         },
//     },

//     // 임계값(Thresholds)
//     thresholds: {
//         http_req_failed: [
//             { threshold: "rate<0.05", abortOnFail: true }, // 실패율 5% 미만
//         ],
//         dropped_iterations: [
//             { threshold: "rate<0.05", abortOnFail: true }, // 드롭된 시나리오 5% 미만
//         ],
//         http_req_duration: [
//             { threshold: "p(95)<3000", abortOnFail: true }, // 95퍼센타일 3초 미만
//         ],
//     },
// };

export const options = {
    scenarios: {
        simple_rps_test: {
            executor: "constant-arrival-rate",
            rate: 1000, // 초당 500개의 요청 (RPS)
            timeUnit: "1s", // RPS 단위 설정
            duration: "1m", // 테스트 지속 시간: 10초
            preAllocatedVUs: 1500, // 미리 할당할 VU 수
            maxVUs: 2000, // 최대 VU 수
        },
    },
    // 태그 추가
    tags: {
        testName: "v2-test-application",
        testType: "performance",
        component: "test",
        version: "2.0",
    },
    thresholds: {
        http_req_failed: [{ threshold: "rate<0.05", abortOnFail: true }],
        dropped_iterations: [{ threshold: "rate<0.05", abortOnFail: true }],
        http_req_duration: [{ threshold: "p(95)<3000", abortOnFail: true }],
    },
};

// 실제 테스트 함수
export default function () {
    const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";

    // Guard를 전혀 타지 않는 /test 엔드포인트 호출
    const res = http.get(`${BASE_URL}/test`, {
        timeout: "60s",
    });

    // 응답 바디 길이를 Trend 메트릭에 기록(예시)
    dataReceivedTrend.add(res.body.length);

    // 응답 코드 확인
    check(res, {
        "test status is 200": (r) => r.status === 200,
    });

    // 각 VU마다 1초 쉼 (필요 없으면 제거 가능)
    sleep(1);
}
