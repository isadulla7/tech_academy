# 🚀 Tech Academy v1

<div align="center">

### **Android, Kotlin, Java va Fintech Masterclass Ta'lim Platformasi**
*0 dan Senior darajagacha: Fundamental Nazariya, Xotira Arxitekturasi, Bank Production Amaliyoti va Texnik Intervyu Tayyorgarligi*

[![Live Website](https://img.shields.io/badge/🌐_Live_Website-Online-38bdf8?style=for-the-badge&logo=googlechrome&logoColor=white)](https://isadulla7.github.io/tech_academy/)
[![Lessons](https://img.shields.io/badge/📚_Darslar-110_ta_masterclass-34d399?style=for-the-badge)](https://isadulla7.github.io/tech_academy/)
[![Questions](https://img.shields.io/badge/🎯_Texnik_Sinov-75_ta_savol-fbbf24?style=for-the-badge)](https://isadulla7.github.io/tech_academy/)
[![Modules](https://img.shields.io/badge/📁_Modullar-17_ta_blok-818cf8?style=for-the-badge)](https://isadulla7.github.io/tech_academy/)
[![License](https://img.shields.io/badge/📄_Litsenziya-MIT-f43f5e?style=for-the-badge)](https://isadulla7.github.io/tech_academy/)

### 🔗 **Platformani to‘g‘ridan-to‘g‘ri brauzerda ochish:**  
## 👉 [https://isadulla7.github.io/tech_academy/](https://isadulla7.github.io/tech_academy/) 👈

</div>

---

## 📌 Loyiha haqida

**Tech Academy v1** — bu dasturchilarning amaliy tajribasini (Middle/Senior) mustahkam fundamental nazariya, xotira va apparat darajasidagi chuqur bilimlar hamda bank intervyulari talablariga moslash uchun yaratilgan to‘liq offline va interaktiv ta’lim tizimi.

Ko‘p dasturchilar kod yozadi, lekin tizim orqa fonda (Under the Hood) qanday ishlashini, operativ xotirada nima bo‘lishini va nima uchun yirik fintech tizimlari kutilmaganda sinishini to‘liq tasavvur qila olmaydi. Ushbu platforma aynan shu bo‘shliqni to‘ldirish uchun 0 dan boshlab ishlab chiqilgan.

---

## 💎 Nega Tech Academy? (9 Bosqichli O‘qitish Tizimi)

Har bir dars shunchaki quruq ta’rif yoki chet-el darsliklarining tarjimasi emas. Har bir mavzu **9 ta qat’iy muhandislik bosqichi**da yoritiladi:

1. **💡 Amaliyotdagi holat:** Real bank va ishlab chiqarishdagi keys (karta to‘lovlari, tranzaksiyalar, UI kechikishlari).
2. **1. Muammo nima?:** Ushbu mexanizm kashf etilishidan oldingi apparat yoki tizim muammosi.
3. **2. Dasturchi uchun mental model:** Muhandislik darajasidagi aniq va esda qolarli model.
4. **3. Xotirada va baytkodda nima sodir bo‘ladi?:** RAM (Stack vs Heap), CPU registrlari va baytkod darajasidagi ASCII arxitektura sxemalari.
5. **4. Amaliy kod va tahlili:** Clean Architecture, Kotlin, Java va Oracle PL/SQL kodlari qatorma-qator tahlili bilan.
6. **💥 Real Production Avariyasi (Post-Mortem):** Bank ishlab chiqarishida ro‘y bergan haqiqiy nosozlik, ildiz sababi va uni tuzatish yo‘li.
7. **🎯 Intervyuerning Tuzoqli Savoli (Trick Question):** Junior javobi (chalg‘igan) vs Senior javobi (apparat darajasida asoslangan).
8. **🗣️ Suhbatda Qanday Aytish Kerak (Speaking Template):** Suhbatda tutilmasdan, aniq va ishonchli gapirish uchun tayyor so‘zma-so‘z iboralar.
9. **🔬 Under the Hood (Chuqur tahlil):** Kompilyator optimizatsiyalari (Escape Analysis, Scalar Replacement, VTable, JIT/AOT).

---

## 📚 O‘quv Dasturi va Modullar Mundarijasi (110 ta Masterclass Dars)

Platforma 17 ta ketma-ket, mantiqiy bog‘langan modullardan iborat:

| № | Modul kodi | Modul nomi | Darslar soni | Qamrab olingan asosiy mavzular |
|:---:|:---:|---|:---:|---|
| **1** | `FND` | **Apparat va Xotira Asoslari** | 7 ta dars | ART vs Dalvik, DEX baytkod, Reference, Stack vs Heap, VTable, Call Stack, Thread Stack (-Xss = 1MB), Memory Leaks |
| **2** | `OOP` | **Obyektga Yo‘naltirilgan Dasturlash (OOP)** | 5 ta dars | Abstraksiya, Inkapsulyatsiya, Polimorfizm, SOLID tamoyillari (SRP, OCP, LSP, ISP, DIP), Composition vs Inheritance |
| **3** | `KT` | **Chuqur Kotlin & JVM Bytecode** | 9 ta dars | Null-Safety, Intrinsics, Data classes, inline, reified, Kotlin 2.0 K2 Kompilyatori (FIR) va Compose integratsiyasi |
| **4** | `COR` | **Kotlin Coroutines & Asinxronlik** | 9 ta dars | CoroutineScope, Job vs SupervisorJob, Dispatchers, Exception propagation, Cancellation, Channels, Mutex |
| **5** | `FL` | **Kotlin Flow & Reaktiv Dasturlash** | 8 ta dars | Cold vs Hot Flow, StateFlow, SharedFlow, Backpressure, buffer(), conflate(), flatMapLatest, Lifecycle-aware collection |
| **6** | `AN` | **Android SDK & Internals** | 12 ta dars | Activity Lifecycles, ViewModel, Process Death (LMK), ANR, Android 15/16 16KB Page Size NDK & C++ arxitekturasi |
| **7** | `CP` | **Jetpack Compose & Deklarativ UI** | 8 ta dars | Recomposition, Skippable vs Unstable tiplar, Snapshot State, remember vs rememberSaveable, derivedStateOf, Side Effects |
| **8** | `AR` | **Clean Architecture & DI (Hilt)** | 3 ta dars | MVI, MVVM, Clean Architecture qatlamlari, Hilt (Compile-time) vs Koin (Runtime Service Locator) |
| **9** | `SEC` | **Xavfsizlik & Kriptografiya** | 3 ta dars | Android Keystore (TEE/StrongBox), SSL Certificate Pinning, Root & Emulator aniqlash (Tamper detection) |
| **10** | `JV` | **Java Core & JVM Xotirasi** | 4 ta dars | ClassLoader ierarxiyasi, Java Memory Model (JMM), Generational GC (Minor vs Full GC), Garbage Collectors (G1, ZGC) |
| **11** | `JCON`| **Java Concurrency & Multithreading** | 3 ta dars | volatile, CAS, ThreadPoolExecutor, Java 21+ Virtual Threads (Project Loom), Carrier Threads va Pinning tuzog‘i |
| **12** | `SQL` | **Relyatsion Bazalar & SQL (Oracle)** | 9 ta dars | B-Tree indekslar, EXPLAIN PLAN, SGA vs PGA, Oracle 23ai vs 19c, Table Partitioning, NUMBER(p, s) arifmetikasi, MERGE INTO |
| **13** | `TX`  | **Tranzaksiyalar & ACID Prinsiplari** | 13 ta dars | ACID, MVCC, Deadlock, TM Locks, ORA-01555, Context Switching & Bulk, Paketlar & ORA-04068, Exceptions, Triggers & Mutating Table, Dynamic SQL, SKIP LOCKED, SYS_REFCURSOR |
| **14** | `SP`  | **Spring Boot & Backend Arxitekturasi** | 7 ta dars | PL/SQL paketlar, HikariCP Pool, @Transactional Proxy, Spring Boot 3 AOT & GraalVM Native Image, Micrometer Tracing |
| **15** | `FB`  | **Fintech & To‘lov Tizimlari** | 3 ta dars | Double-Entry Ledger (Debit = Credit), Idempotency, 401 Token Refresh Race Condition, Taqsimlangan tranzaksiyalar |
| **16** | `REAL`| **Real Intervyu Savollari (Masterclass)**| 6 ta dars | Asia Alliance Bank 5 ta savol, Idempotency & Double-Charge, Process Death & LMK, Compose Lag, Oracle Deadlock, Coroutines Traps |
| **17** | `HR`  | **HR & Madaniy Moslik** | 1 ta dars | STAR metodikasi, Karyera muzokaralari, Soft skills va xalqaro intervyu psixologiyasi |

---

### 🔥 REAL Moduli: Yirik Fintech Suhbatlarida Tushgan Savollar
* **REAL-001:** Asia Alliance Bank va Fintech suhbatlarida berilgan 5 ta asosiy savol (Kotlin vs Java, Double taqiqi, inline, Hilt vs Koin, Coroutines).
* **REAL-002:** Fintech va Karta To‘lovlari: Idempotency-Key, Distributed Race Condition va Double-Charge oldini olish.
* **REAL-003:** Android Internals: Process Death, Low Memory Killer (LMK), Activity Recreation va SavedStateHandle vs ViewModel.
* **REAL-004:** Jetpack Compose Internals: Recomposition Loop, Skippable va Unstable tiplar hamda Snapshot State.
* **REAL-005:** Tranzaksiyalar va Deadlock: ORA-00060, SELECT FOR UPDATE, Pessimistic vs Optimistic Locking.
* **REAL-006:** Coroutines Tuzoqlari: Exception Propagation, SupervisorJob vs Job va CancellationException'ni yutib yuborish falokati.

---

## 🎯 Interaktiv Imkoniyatlar

- **🎯 Texnik Sinov (Mock Interview Simulator):**
  Yuqori paneldagi "🎯 Sinov" tugmasini bosing. Tizim sizga 60 soniyali taymer bilan 75 ta saralangan intervyu savollaridan birini taqdim etadi. Ovoz chiqarib javob berib, o‘zingizni haqiqiy suhbatdagidek sinaysiz.
- **📑 Ierarxik Mundarija (Table of Contents):**
  Chap tomonda barcha modullar ochiluvchi/yopiluvchi daraxt (Accordion) shaklida joylashgan. Har bir dars o‘z status belgisi bilan ko‘rinadi (`✓` Tushundim, `★` Tushuntira olaman, `?` Zaif, `○` O‘qilmagan).
- **🔬 Under the Hood (Ochiq bo‘lim va Tezkor sakrash):**
  Har bir dars oxirida chuqur muhandislik bo‘limi doimo ochiq turadi. Yuqoridagi tugma orqali unga bir soniyada silliq tushishingiz mumkin.
- **🔄 Spaced Repetition (Qaytarish tizimi):**
  Tushunmagan darslaringiz avtomatik "Zaif" ro‘yxatiga tushadi va tizim ularni oraliq takrorlash qoidasi asosida eslatib turadi.
- **📊 Knowledge Graph & Resume Mapping:**
  Mavzular o‘rtasidagi bog‘liqlik zanjiri va o‘zlashtirgan bilimlaringizni rezyumega qanday kiritish bo‘yicha amaliy yo‘riqnoma.

---

## 🚀 Qanday ishga tushiriladi?

### 1-usul: To‘g‘ridan-to‘g‘ri internetda (Eng qulay va tavsiya etilgan usul)
Hech narsa yuklab olish yoki o‘rnatish shart emas. Istalgan kompyuter, planshet yoki smartfon brauzerida oching:  
👉 **[https://isadulla7.github.io/tech_academy/](https://isadulla7.github.io/tech_academy/)**

### 2-usul: O‘z kompyuteringizda (100% Offline)
1. Repozitoriyani klon qiling:
   ```bash
   git clone https://github.com/isadulla7/tech_academy.git
   ```
2. Loyiha papkasiga kiring:
   ```bash
   cd tech_academy
   ```
3. `index.html` faylini istalgan brauzerda oching.

### ⌨️ Klaviatura orqali qulay boshqarish:
* `→` (O‘ng strelka): Keyingi darsga o‘tish (avtomatik sahifa boshiga o‘tadi)
* `←` (Chap strelka): Oldingi darsga qaytish
* `Escape`: Ochiq modal oynalarni yopish

---

## 🛠 Texnologik Stek

* **Frontend:** Sof HTML5, zamonaviy CSS3 (Developer Dark Theme, WCAG AAA yuqori kontrast), Vanilla JavaScript (ES6+).
* **Arxitektura:** Server talab qilmaydi, 100% Client-Side va Offline-First (PWA manifest).
* **Xotira:** Darslar o‘zlashtirilishi, tushunarsiz qaydlar va shaxsiy statistika brauzerning xavfsiz `localStorage` xotirasida saqlanadi.

---

## 📄 Litsenziya

Ushbu loyiha [MIT Litsenziyasi](LICENSE) asosida ochiq taqdim etiladi. Shaxsiy bilimni oshirish, dasturlash jamoalari va texnik intervyularga tayyorgarlik ko‘rish uchun erkin foydalanishingiz mumkin.
