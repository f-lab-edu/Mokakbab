import { check, sleep } from "k6";
import http from "k6/http";
import { Rate, Trend } from "k6/metrics";

const dataReceivedTrend = new Trend("data_received_size", true);

const errorRate = new Rate("errors");
const requestFailRate = new Rate("request_fails");

export const options = {
    stages: [
        { duration: "2m", target: 1500 }, // 최대 부하 유지
        { duration: "1m", target: 0 }, // 빠르게 부하 감소
    ],
    tags: {
        testName: "prod6-spike-signup6",
        testType: "spike",
        component: "signup",
        version: "1.0",
    },
};

export default function () {
    const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";

    const timestamp = new Date().getTime();
    const randomValue = Math.random().toString(36).substring(2, 15);
    const uniqueId = `${timestamp}-${randomValue}`;

    const signupResponse = http.post(
        `${BASE_URL}/auth/sign-up`,
        {
            email: `user-${uniqueId}@test.com`,
            password: "123456",
            name: `user-${uniqueId}`.substring(0, 6),
            nickname: `nickname-${uniqueId}`.substring(0, 6),
        },
        {
            timeout: "60s",
            tags: { name: "signup" },
        },
    );

    if (signupResponse.body) dataReceivedTrend.add(signupResponse.body.length);

    // 응답 상태 체크 및 에러율 기록
    const isSuccessful = check(signupResponse, {
        "signup status is 201": (r) => r.status === 201,
    });

    if (!isSuccessful) {
        errorRate.add(1);
        requestFailRate.add(1);
    }

    if (signupResponse.status >= 400) {
        requestFailRate.add(1);
    }

    sleep(0.01);
}
