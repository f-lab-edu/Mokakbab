import { check, sleep } from "k6";
import http from "k6/http";
import { Trend } from "k6/metrics";

const dataReceivedTrend = new Trend("data_received_size", true);

export const options = {
    scenarios: {
        simple_rps_test: {
            executor: "constant-arrival-rate",
            rate: 500,
            timeUnit: "1s",
            duration: "1m",
            preAllocatedVUs: 700,
            maxVUs: 1000,
        },
    },
    // 태그 추가
    tags: {
        testName: "v2-participations-application",
        testType: "performance",
        component: "participations",
        version: "2.0",
    },
    thresholds: {
        http_req_failed: [{ threshold: "rate<0.05", abortOnFail: true }],
        dropped_iterations: [{ threshold: "rate<0.05", abortOnFail: true }],
        http_req_duration: [{ threshold: "p(95)<3000", abortOnFail: true }],
    },
};

// export const options = {
//     scenarios: {
//         fixed_iterations_test: {
//             executor: "per-vu-iterations", // 각 VU가 고정된 횟수만큼 요청을 보냄
//             vus: 10, // 가상 사용자 수 (10명)
//             iterations: 100, // 요청 총 횟수 (10명 * 10회 = 100 요청)
//             maxDuration: "1m", // 테스트 최대 실행 시간 (필요시 설정)
//         },
//     },
//     // 태그 추가
//     tags: {
//         testName: "100-request-test",
//         testType: "performance",
//         component: "signup",
//         version: "2.0",
//     },
//     thresholds: {
//         http_req_failed: [{ threshold: "rate<0.05", abortOnFail: true }],
//         http_req_duration: [{ threshold: "p(95)<3000", abortOnFail: true }],
//     },
// };

// export const options = {
//     scenarios: {
//         ramp_up_test: {
//             executor: "ramping-arrival-rate",
//             startRate: 50,
//             timeUnit: "1s",
//             stages: [
//                 { target: 100, duration: "2m" },
//                 { target: 200, duration: "3m" },
//                 { target: 500, duration: "5m" },
//             ],
//             preAllocatedVUs: 700, // 최대 target (500)보다 약간 여유 있는 수준으로 설정
//             maxVUs: 1000, // 최대 target과 맞추어 설정
//         },
//     },
//     // 태그 추가
//     tags: {
//         testName: "v2-participations-application",
//         testType: "performance",
//         component: "participations",
//         version: "2.0",
//     },
//     thresholds: {
//         http_req_failed: [{ threshold: "rate<0.05", abortOnFail: true }],
//         dropped_iterations: [{ threshold: "rate<0.05", abortOnFail: true }],
//         http_req_duration: [{ threshold: "p(95)<3000", abortOnFail: true }],
//     },
// };

export default function () {
    const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";
    const ACCESS_TOKEN = __ENV.ACCESS_TOKEN || "access_token";

    const cursors = [12001, 23000, 30000, 40000, 50000];
    const cursor = cursors[Math.floor(Math.random() * cursors.length)];
    const limit = 10;

    const articleIds = [23640, 12714, 11621, 43514];

    const participationsResponse = http.get(
        `${BASE_URL}/participations/articles/${articleIds[Math.floor(Math.random() * articleIds.length)]}?cursor=${cursor}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
            timeout: "60s",
        },
    );

    dataReceivedTrend.add(participationsResponse.body.length);

    check(participationsResponse, {
        "participations status is 200": (r) => r.status === 200,
    });

    sleep(1);
}
