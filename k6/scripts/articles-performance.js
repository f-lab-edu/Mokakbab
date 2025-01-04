import { check, sleep } from "k6";
import http from "k6/http";
import { Trend } from "k6/metrics";

const dataReceivedTrend = new Trend("data_received_size", true);

// export const options = {
//     scenarios: {
//         simple_rps_test: {
//             /* 일정한 RPS(Request Per Second)를 유지하는 실행기 타입 */
//             executor: "constant-arrival-rate",
//             /* 초당 실행할 반복 횟수 */
//             rate: 200,
//             /* rate의 시간 단위 (1s, 1m, 1h 등) */
//             timeUnit: "1s",
//             /* 전체 테스트 실행 시간 */
//             duration: "3m",
//             /* 테스트 시작 시 미리 할당할 가상 사용자 수 */
//             preAllocatedVUs: 300,
//             /* 최대 가상 사용자 수 (필요시 추가 할당) */
//             maxVUs: 400,
//         },
//     },
//     // 태그 추가
//     tags: {
//         testName: "v2-articles-application3",
//         testType: "performance",
//         component: "articles",
//         version: "2.0",
//     },
//     thresholds: {
//         /* HTTP 요청 실패율이 5% 미만이어야 함 */
//         http_req_failed: [{ threshold: "rate<0.05", abortOnFail: true }],
//         /* 부하로 인한 요청 누락률이 5% 미만이어야 함 */
//         dropped_iterations: [{ threshold: "rate<0.05", abortOnFail: true }],
//         // /* 95%의 요청이 3초 이내에 완료되어야 함 */
//         http_req_duration: [{ threshold: "p(95)<3000", abortOnFail: true }],
//     },
// };

export const options = {
    scenarios: {
        gradual_rps_test: {
            executor: "ramping-arrival-rate",
            startRate: 50, // 시작 RPS
            timeUnit: "1s",
            preAllocatedVUs: 800,
            maxVUs: 1000,
            stages: [
                { target: 100, duration: "30s" }, // 30초 동안 100 RPS로 증가
                { target: 300, duration: "30s" }, // 30초 동안 300 RPS로 증가
                { target: 500, duration: "1m" }, // 1분 동안 500 RPS 유지
                { target: 0, duration: "30s" }, // 30초 동안 RPS를 0으로 감소
            ],
        },
    },
    tags: {
        testName: "v2-participations-application",
        testType: "performance",
        component: "participations",
        version: "2.0",
    },
    thresholds: {
        http_req_failed: [{ threshold: "rate<0.05" }],
        dropped_iterations: [{ threshold: "rate<0.05" }],
        http_req_duration: [{ threshold: "p(95)<3000" }],
    },
};

export default function () {
    const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";
    const ACCESS_TOKEN = __ENV.ACCESS_TOKEN || "access_token";

    const cursors = [12001, 23000, 30000, 40000, 50000];
    const cursor = cursors[Math.floor(Math.random() * cursors.length)];
    const limit = 10;

    const articlesResponse = http.get(
        `${BASE_URL}/articles?cursor=${cursor}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
            timeout: "60s",
            tags: { name: "articles" },
        },
    );

    if (articlesResponse.body)
        dataReceivedTrend.add(articlesResponse.body.length);

    check(articlesResponse, {
        "articles status is 200": (r) => r.status === 200,
    });

    sleep(1);
}
