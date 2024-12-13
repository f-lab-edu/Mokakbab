import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { DistrictEntity } from "@APP/entities/district.entity";

const DISTRICT_NAMES_SEOUL = [
    // depth=2 지역들
    "강남구",
    "송파구",
    "강북/노원/도봉",
    "성북구·종로구",
    "강서구",
    "서초구",
    "관악구",
    "마포구",
    "노원구",
    "강동구",
    "영등포구",
    "은평구",
    "양천구",
    "성북구",
    "구로구",
    "구로구/금천구",
    "동작구",
    "광진구",
    "동대문구",
    "중랑구",
    "서대문구",
    "성동구",
    "중구/성동구",
    "용산구",
    "도봉구",
    "강북구",
    "금천구",
    "종로구",
    "중구",

    // depth=3 지역들
    "강남구/역삼동",
    "강서구/마곡동",
    "강남구/청담동",
    "강서구/화곡동",
    "강남구/논현동",
    "강남구/대치동",
    "강남구/삼성동",
    "강남구/압구정동",
    "강북구/미아동",
    "강동구/상일동",
    "강동구/길동",
    "강남구/신사동",
    "강남구/역삼1동",
    "강동구/천호동",
    "강서구/염창동",
    "강남구/도곡동",
    "강동구/성내동",
    "강남구/개포동",
    "강동구/강일동",
    "강남구/논현1동",
    "강서구/내발산동",
    "강서구/방화동",
    "강서구/등촌동",
    "강남구/역삼2동",
    "강동구/암사동",
    "강서구/우장산동",
    "강서구/화곡제1동",
    "강동구/명일동",
    "강남구/대치4동",
    "강북구/수유동",
    "강동구/고덕동",
    "강남구/삼성2동",
    "강남구/자곡동",
    "강북구/수유3동",
    "강북구/삼각산동",
    "강서구/화곡본동",
    "강남구/대치2동",
    "강남구/논현2동",
    "강서구/등촌제3동",
    "강서구/가양동",
    "강서구/공항동",
    "강남구/일원동",
    "강남구/개포4동",
    "강남구/대치1동",
    "강서구/화곡제6동",
    "강남구/세곡동",
    "강서구/화곡제3동",
    "강남구/수서동",
    "강북구/수유2동",
    "강동구/천호제1동",
    "강동구/둔촌동",
    "강남구/개포1동",
    "강북구/수유1동",
    "강동구/천호제3동",
    "강북구/송중동",
    "강남구/개포3동",
    "강남구/도곡1동",
    "강남구/삼성1동",
    "강서구/방화제1동",
    "강북구/삼양동",
    "강남구/개포2동",
    "강남구/도곡2동",
    "강서구/발산제1동",
    "강서구/화곡제4동",
    "강북구/번1동",
    "강북구/인수동",
    "강남구/일원본동",
    "강서구/등촌제1동",
    "강북구/번동",
    "강동구/성내제2동",
    "강서구/화곡제2동",
    "강동구/성내제3동",
    "강동구/천호제2동",
    "강동구/암사제1동",
    "강북구/송천동",
    "강동구/명일제1동",
    "강서구/등촌제2동",
    "강서구/가양제1동",
    "강서구/방화제2동",
    "강동구/고덕제2동",
    "강동구/암사제3동",
    "강동구/고덕제1동",
    "강서구/가양제3동",
    "강북구/우이동",
    "강남구/일원1동",
    "강동구/둔촌제2동",
    "강서구/방화제3동",
    "강동구/성내제1동",
    "강북구/번3동",
    "강동구/암사제2동",
    "강서구/가양제2동",
    "강북구/번2동",
    "강남구/율현동",
    "강동구/명일제2동",
    "강서구/외발산동",
    "강동구/둔촌제1동",
    "강서구/개화동",
    "강서구/오곡동",
    "강서구/과해동",
    "강서구/오쇠동",
];

const DISTRICT_NAMES_GYEONGGI = [
    // depth=2 지역
    "화성시",
    "기흥구/처인구/수지구",
    "성남시",
    "수원시",
    "안산시",
    "평택시",
    "남양주시",
    "고양시",
    "부천시",
    "성남시 분당구",
    "시흥시",
    "김포시",
    "파주시",
    "의정부시",
    "고양시 덕양구",
    "부천시 원미구",
    "용인시 기흥구",
    "수원시 영통구",
    "안산시 단원구",
    "수원시 권선구",
    "평택소방서",
    "용인시 수지구",
    "광주시",
    "안산시 상록구",
    "안양시 동안구",
    "분당",
    "고양시 일산동구",
    "하남시",
    "죽전/수지",
    "고양시 일산서구",
    "수정구/중원구",
    "오산시",
    "수원시 장안구",
    "양주시",
    "용인시 처인구",
    "광명시",
    "수원시 팔달구",
    "군포시",
    "성남시 수정구",
    "이천시",
    "운정/파주",
    "부천시 소사구",
    "안양시 만안구",
    "안성시",
    "구리시",
    "성남시 중원구",
    "가평군/양평군/연천군",
    "부천시 오정구",
    "의왕시",
    "판교",
    "포천시",
    "동탄신도시",
    "여주시",
    "양평군",
    "동두천시",
    "과천시",
    "가평군",
    "연천군",
    "테크노밸리",

    // depth=3 지역
    "고양시 일산서구/대화동",
    "고양시 일산서구/탄현동",
    "고양시 일산동구/중산동",
    "고양시 일산동구/식사동",
    "고양시 덕양구/행신동",
    "고양시 덕양구/화정동",
    "고양시 일산동구/백석동",
    "고양시 일산동구/장항동",
    "고양시 일산동구/풍동",
    "고양시 일산서구/덕이동",
    "고양시 일산서구/주엽동",
    "고양시 일산동구/정발산동",
    "고양시 덕양구/삼송동",
    "고양시 일산서구/일산동",
    "고양시 덕양구/원흥동",
    "고양시 일산서구/일산3동",
    "고양시 일산동구/마두동",
    "고양시 덕양구/향동동",
    "고양시 덕양구/화정2동",
    "고양시 덕양구/도내동",
    "고양시 덕양구/지축동",
    "고양시 덕양구/고양동",
    "고양시 덕양구/신원동",
    "고양시 덕양구/동산동",
    "가평군/가평읍",
    "고양시 덕양구/행신3동",
    "과천시/별양동",
    "고양시 일산서구/일산1동",
    "고양시 덕양구/화정1동",
    "고양시 덕양구/행신2동",
    "고양시 일산서구/가좌동",
    "고양시 일산동구/백석1동",
    "고양시 일산서구/주엽1동",
    "고양시 덕양구/토당동",
    "고양시 일산동구/장항2동",
    "고양시 덕양구/관산동",
    "과천시/갈현동",
    "고양시 덕양구/성사1동",
    "고양시 일산동구/장항1동",
    "고양시 일산서구/주엽2동",
    "고양시 덕양구/주교동",
    "고양시 일산동구/마두1동",
    "고양시 덕양구/내유동",
    "고양시 덕양구/덕은동",
    "고양시 덕양구/행신1동",
    "과천시/중앙동",
    "고양시 일산동구/백석2동",
    "과천시/원문동",
    "고양시 일산서구/일산2동",
    "고양시 덕양구/능곡동",
    "과천시/부림동",
    "고양시 일산동구/성석동",
    "가평군/청평면",
    "고양시 일산동구/마두2동",
    "고양시 덕양구/성사동",
    "고양시 덕양구/성사2동",
    "가평군/조종면",
    "가평군/설악면",
    "고양시 일산서구/송포동",
    "고양시 일산동구/풍산동",
    "과천시/문원동",
    "고양시 덕양구/창릉동",
    "고양시 덕양구/오금동",
    "고양시 일산동구/사리현동",
    "과천시/과천동",
    "고양시 덕양구/행신4동",
    "고양시 덕양구/화전동",
    "고양시 덕양구/흥도동",
    "가평군/상면",
    "고양시 일산동구/설문동",
    "고양시 일산서구/송산동",
    "고양시 덕양구/대자동",
    "고양시 일산동구/고봉동",
    "과천시/주암동",
    "고양시 덕양구/용두동",
    "고양시 덕양구/원당동",
    "고양시 덕양구/벽제동",
    "고양시 덕양구/행주동",
    "고양시 일산동구/문봉동",
    "가평군/북면",
    "고양시 덕양구/대덕동",
    "고양시 일산서구/구산동",
    "고양시 덕양구/대장동",
    "광명시/광명1동",
    "고양시 덕양구/원신동",
    "고양시 일산동구/지영동",
    "고양시 일산서구/법곳동",
    "고양시 덕양구/내곡동",
    "고양시 덕양구/현천동",
    "광명시/가학동",
    "고양시 덕양구/행주내동",
    "고양시 덕양구/강매동",
    "고양시 일산동구/산황동",
    "과천시/막계동",
    "고양시 덕양구/행주외동",
    "고양시 덕양구/효자동",
    "고양시 덕양구/선유동",
    "과천시/관문동",
    "고양시 덕양구/신평동",
    "고양시 덕양구/북한동",
];

export default class DistrictSeeder implements Seeder {
    public async run(
        _dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const districtFactory = factoryManager.get(DistrictEntity);

        await Promise.all(
            DISTRICT_NAMES_SEOUL.map((name) =>
                districtFactory.save({ name, regionId: 1 }),
            ),
        );

        await Promise.all(
            DISTRICT_NAMES_GYEONGGI.map((name) =>
                districtFactory.save({ name, regionId: 2 }),
            ),
        );

        console.log(`지역 구분류 생성 완료`);
    }
}