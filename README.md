<p align="center">
  <div align="center"><img src="https://i.postimg.cc/Y9H8D4mX/88c510ba-dd30-4104-855e-18e1bef286a3.png" width="80%"/></div>
</p>

<p align="center">"모여서 각자 밥먹기(모각밥!)"<br> <span>당근마켓</span>의 동네생활의 동네 밥친구 구하기 기능만 구현한 프로젝트입니다.</p>

<br>
<br>

### 🥕 당근마켓 같이해요 최고의 인기모임은 함께 밥먹기 입니다.

- [관련 자료 링크](https://about.daangn.com/company/pr/archive/%EB%8B%B9%EA%B7%BC%EB%A7%88%EC%BC%93-%EA%B0%99%EC%9D%B4%ED%95%B4%EC%9A%94-%EC%B5%9C%EA%B3%A0-%EC%9D%B8%EA%B8%B0-%EB%AA%A8%EC%9E%84%EC%9D%80-%ED%95%A8%EA%BB%98%EB%B0%A5%EB%A8%B9%EA%B8%B0/)
- MAU 1000만 사용자 서비스라고 가정하고 요구되는 RPS가 어느정도이며 하나의 애플리케이션 서버가 해당 목표 RPS에 도달하기 위한 과정을 담은 프로젝트 입니다.

#### 🥕 MAU 1천만 사용자를 위한 시스템의 RPS 요구사항 분석

- [📝 MAU 1천만 사용자를 위한 시스템의 RPS 요구사항을 분석 해보자](https://yokan.netlify.app/project/mokakbab)

---

## 🥕 프로젝트 설계

- 프로젝트 성능 테스트 환경
    - [📋 API 명세서](https://github.com/f-lab-edu/Mokakbab/wiki/API-%EB%AA%85%EC%84%B8%EC%84%9C)
    - [📊 ERD (Entity Relationship Diagram)](<https://github.com/f-lab-edu/Mokakbab/wiki/%F0%9F%93%8A-ERD-(Entity-Relationship-Diagram)>)
    - [🔍 Query Patterns](https://curvy-wood-aa3.notion.site/181135d46c8f80a1a748f6eca2d7c381?pvs=4)
    - [🧪 부하 테스트 환경과 개요](https://github.com/f-lab-edu/Mokakbab/wiki/%ED%99%98%EA%B2%BD%EA%B3%BC-%EA%B0%9C%EC%9A%94)

## 🥕 프로젝트 결과 리포트

- [✨ 프로젝트 리포트](https://curvy-wood-aa3.notion.site/1cf135d46c8f80eca2c6c2959bc57db3?pvs=4)
    - 데이터베이스 환경
    - 쿼리 패턴
    - 최종 결과
    - 결과 히스토리
    - 후기

## 🥕 트러블 슈팅 (Troubleshooting)

- [Aws와 S3 업로드시 Cpu Bound](https://yokan.netlify.app/project/mokakbab/trouble-shooting/6)
- [Typeorm의 N+1와 findOne 메서드 사용시 중복 쿼리 문제](https://yokan.netlify.app/project/mokakbab/trouble-shooting/3)
- [Typeorm과 Mysql 사용시 Insert 최적화](https://yokan.netlify.app/project/mokakbab/trouble-shooting/4)
- [Jsonwebtoken 사용과 문제](https://yokan.netlify.app/project/mokakbab/trouble-shooting/1)
- [Typeorm Seeding 성능 문제](https://yokan.netlify.app/project/mokakbab/trouble-shooting/2)

## 🥕 InfraStructure

- NCP에 Performance 개선을 위한 배포 및 프로파일링 진행
  <br>
  <img src="https://i.postimg.cc/GtW6W6hd/mokakbab-profiling-server.png" width="70%"/></div>
  <br>
- Perfomance 향상 및 문제해결 후 AWS 배포
  <br>
  <img src="https://i.postimg.cc/Kvb65SVD/mokakbab-aws.png" width="70%"/></div>
  <br>
