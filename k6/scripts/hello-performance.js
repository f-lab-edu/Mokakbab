import { check, sleep } from "k6";
import http from "k6/http";
import { Trend } from "k6/metrics";

const dataReceivedTrend = new Trend("data_received_size", true);

export const options = {
    // 여러 시나리오 정의
    scenarios: {
        // 1) ramp_up 시나리오
        ramp_up: {
            executor: "ramping-arrival-rate",
            startRate: 50, // 초당 50 요청으로 시작
            timeUnit: "1s", // RPS 단위
            preAllocatedVUs: 100, // ramp-up 초기에 미리 할당할 VU 수
            maxVUs: 500, // 최대 VU 수
            stages: [
                { target: 500, duration: "1m" }, // 1분 동안 50→500 RPS 상승
            ],
            gracefulStop: "0s", // ramp_up 시나리오 끝나면 바로 종료
        },

        // 2) steady_state 시나리오
        steady_state: {
            executor: "constant-arrival-rate",
            rate: 500, // 초당 500 요청
            timeUnit: "1s",
            duration: "2m", // 2분 동안 유지
            startTime: "1m", // ramp_up 끝나는 시점(1분) 이후 시작
            preAllocatedVUs: 700,
            maxVUs: 1000,
        },
    },
};

export default function () {
    const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";
    const ACCESS_TOKEN = __ENV.ACCESS_TOKEN || "access_token";

    const helloResponse = http.get(`${BASE_URL}`, {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        timeout: "60s",
    });

    dataReceivedTrend.add(helloResponse.body.length);

    check(helloResponse, {
        "hello status is 200": (r) => r.status === 200,
    });

    sleep(1);
}
