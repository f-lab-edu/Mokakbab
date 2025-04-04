import { check, sleep } from "k6";
import http from "k6/http";
import { Rate, Trend } from "k6/metrics";

const dataReceivedTrend = new Trend("data_received_size", true);

const errorRate = new Rate("errors");
const requestFailRate = new Rate("request_fails");

const imageFiles = [
    open("uploads/test-image01.jpg", "b"),
    open("uploads/test-image02.jpg", "b"),
    open("uploads/test-image03.jpg", "b"),
];

export const options = {
    //discardResponseBodies: true, // 응답 본문을 무시 할 수 있는 옵션으로 `data_received` 크기가 너무 커서 아웃 바운드 요금 초과 방지
    scenarios: {
        ramping_requests: {
            executor: "ramping-arrival-rate",
            timeUnit: "1s",
            stages: [
                { duration: "30s", target: 200 },
                { duration: "30s", target: 200 },
                { duration: "30s", target: 0 },
            ],
            preAllocatedVUs: 10, // 초기 VU
            maxVUs: 50, // 필요에 따라 동적으로 추가
        },
    },
    tags: {
        testName: "prod-spike-upload-image-57",
        testType: "spike",
        component: "upload-image",
        version: "1.0",
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

    if (uploadResponse.body) dataReceivedTrend.add(uploadResponse.body.length);

    // 응답 상태 체크 및 에러율 기록
    const isSuccessful = check(uploadResponse, {
        "upload status is 200": (r) => r.status === 200,
    });

    if (!isSuccessful) {
        errorRate.add(1);
        requestFailRate.add(1);
    }

    if (uploadResponse.status >= 400) {
        requestFailRate.add(1);
    }

    sleep(0.01);
}
