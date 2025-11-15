# Vercel 환경변수 설정 가이드

## 문제 상황
현재 API에서 "Invalid PEM formatted message" 에러가 발생하고 있습니다.
Firebase Private Key가 Vercel에 올바르게 설정되지 않았기 때문입니다.

## 해결 방법: Vercel 환경변수 수정

### 단계 1: Vercel 환경변수 페이지에서

이미 설정된 환경변수들을 **삭제**하고 다시 추가해야 합니다.

1. 기존 FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY를 모두 삭제
2. 아래 3개 환경변수를 **새로 추가**

---

### 단계 2: 다음 환경변수들을 추가하세요

#### 환경변수 1
**Key (이름):**
FIREBASE_PROJECT_ID

**Value (값):**
freeclean-mattress

**Environment:** Production, Preview, Development 모두 체크

---

#### 환경변수 2
**Key (이름):**
FIREBASE_CLIENT_EMAIL

**Value (값):**
firebase-adminsdk-fbsvc@freeclean-mattress.iam.gserviceaccount.com

**Environment:** Production, Preview, Development 모두 체크

---

#### 환경변수 3 (가장 중요!)
**Key (이름):**
FIREBASE_PRIVATE_KEY

**Value (값):** 아래 전체를 복사해서 붙여넣으세요
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCtmRYF7Hsx5sA5\nyoOq/aBowQVHnzffkgxoGODMORz0JIo8k8MxXR37K58+E/XSLfRvAdbRQ+YSsQlb\nNLHFcib9PvIGf733wClUARcS882ZRCqKWJNGJ+fl9BHwv6DNrxsqpxVQPdAPAPRX\nVFuqlGxovM/Ji8YFoHug1/ARkLESUkygr3i4hhBWUZU6oWt+6g61KZCatPb04fiC\n7CJ2FODYZ9f6nr8oOsvfh0RucpNhKeI9Sy7Tf7FcYwEyPPbDLGJNlFxrcx1MbrzA\nGztQxY4vVsxPNwU0AzHWukYSk81YnfyFIxb2U6lY3k9LPkSMBy6uX9r0YslnvSg6\n0c81rmWDAgMBAAECggEADbMrHcSP5FxFh0oIIhJp+lphREm4axhnij+MXhGTy2Cm\n2CkBGoAywYOryYZhu/iMdcY7YcBuA8Oc7Wm3LdHYadvx1bl3EHpFyK9dVs2OyC2s\n/cYHuV2k22zrjYhR9GmBR1hwQijeppB4t/ucUFXuSEW+UDWLpx4HI6Zm97vnfX6H\n6KgkWhHdDVhZPL9eov7kUS7VwdRFnYbsyjhmRZDNkV5YgaDL8KFGOd5/qzub+EHZ\nw1QWasFkXcnbL3noYhAU30MU/shJcMfhkShakIKqn8PjfNno327MauxLJVDfkLsF\nyhCORbH++TfGDv7zbpfc7xZ8iYtrt3zBuLJX6/7YAQKBgQDbcn3e9ph7G3Zrcw9K\nezj9Hihuz+wB270YjGx6ZJARQO/odC4Q6dDhc96Idk3ehCzzXg10fBorXHxlZZUq\niB9wPRXLoyLb+U5JnhNM6ElTAZnpIPGRy+Fa0pvjxnH+Cq+x4moYl4ceNy4YPh6A\nx3shzb63hGTPXDc8hwlF3iVnAQKBgQDKg4ZKQSAdFvNjVxU6cB00bqgW3q50UPND\nS/iaggW+p7U4MEAYfk3bnR7bj9a8/MYwJmz1/k+XETa++b4tcd7d5us/tm5Wp5pL\ne9KvmlFPc4DvBgKko75CPbLGARfd4FCRQ5Jee0vRQjh3qBmBwszQ8EydmGJLePza\nNREq+7qwgwKBgFETcseuidVp5w15vBuDfSGfQ8b1ELf7DFkGgImTn9qQCFL0oZRk\nHmU9XulB9DES2lyr0gLIWw7MI7V+m2bUVfEs0GGlCxsEd9UhDvZqF7UQMWH9ZuK7\n1a2thCTaS4FVR2ZMRXCCg0w5jNEuGizwBmEN17mLs4cdBddZ+KYUlfMBAoGBAJ2f\n1ayCGD7MGFDf/RPpI7Il1wtF879xKobc4PlR7qrA2lqLo7fsxykCmHwI7vlWPeRI\nZFLryIMq0NPAi3fPw8ov7DdBBYzJE11hWVF46YTPwDFLGk+Pa40ffMCFJVB7Qfpu\n/8Qub4rG4jCwVHodZ1HRV7DqZMeduiEVYPF10Y+FAoGAbMXz+L/LKe0R5EiaXfRG\nImWlOANiZkzEhS5pP8iQbc0RGQ9VhsshC9esX46CcL4A9Ocb+Ljw4kD5yZGzAWYJ\np5yRCdeyUEKv+hIff0E59fPwf/s79Na9m/gEmjgPIC78aS+kcmG91fTqAtXZzk5Q\ne/SsJfYqTh9POI8epeTIxEw=\n-----END PRIVATE KEY-----\n

**Environment:** Production, Preview, Development 모두 체크

**중요한 주의사항:**
- \n은 실제 줄바꿈이 아니라 백슬래시와 n 문자입니다
- 값 앞뒤에 공백이 없어야 합니다
- 전체를 정확히 복사해서 붙여넣으세요

---

### 단계 3: 저장 및 재배포

1. 3개 환경변수를 모두 추가한 후 "Save" 버튼 클릭
2. Vercel이 자동으로 재배포됩니다 (약 1-2분 소요)
3. 재배포가 완료되면 사이트가 정상 작동합니다

---

## 확인 방법

재배포 완료 후 다음 URL에 접속해서 확인:
- 메인 페이지: https://free-clean-mattress.vercel.app
- API 테스트: https://free-clean-mattress.vercel.app/api/products

정상이면 제품 목록 데이터가 표시됩니다.
