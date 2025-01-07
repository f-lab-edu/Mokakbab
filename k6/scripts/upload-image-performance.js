import { check, sleep } from "k6";
import http from "k6/http";
import { Trend } from "k6/metrics";

const dataReceivedTrend = new Trend("data_received_size", true);

const imageFiles = [
    open("uploads/test-image01.jpg", "b"),
    open("uploads/test-image02.jpg", "b"),
    open("uploads/test-image03.jpg", "b"),
];

export const options = {
    scenarios: {
        simple_rps_test: {
            executor: "constant-arrival-rate",
            rate: 200,
            timeUnit: "1s",
            duration: "1m",
            preAllocatedVUs: 400,
            maxVUs: 600,
        },
    },
    tags: {
        testName: "v1-upload-image-result",
        testType: "performance",
        component: "upload-image",
        version: "1.0",
    },
    thresholds: {
        http_req_failed: [{ threshold: "rate<0.05", abortOnFail: true }],
        dropped_iterations: [{ threshold: "rate<0.05", abortOnFail: true }],
        http_req_duration: [{ threshold: "p(95)<3000", abortOnFail: true }],
    },
};

export default function () {
    const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";
    const ACCESS_TOKEN = __ENV.ACCESS_TOKEN || "access_token";

    const selectedImage =
        imageFiles[Math.floor(Math.random() * imageFiles.length)];

    const filename = `test-image-${Math.random().toString(36).slice(-6)}.jpg`;

    // multipart/form-data 요청을 위한 데이터 준비
    const data = {
        image: http.file(selectedImage, filename, "image/jpeg"),
    };

    const uploadResponse = http.patch(
        `${BASE_URL}/articles/upload-image`,
        data,
        {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
            timeout: "60s",
        },
    );

    dataReceivedTrend.add(uploadResponse.body.length);

    check(uploadResponse, {
        "upload status is 200": (r) => r.status === 200,
        "response has filename": (r) =>
            JSON.parse(r.body).filename !== undefined,
    });

    sleep(1);
}
