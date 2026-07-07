# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

# [1.2.0](https://github.com/stinalina/remember-me/compare/v1.1.1...v1.2.0) (2026-07-07)


### feat

* **NOTIFY-189:** add duplicate btn for notes (#122) ([](https://github.com/stinalina/remember-me/commit/a3aa196e128a830d60f8c98b70c4d6334d75c5d7)), closes [#122](https://github.com/stinalina/remember-me/issues/122)
* **NOTIFY-89:** settings page (#117) ([](https://github.com/stinalina/remember-me/commit/5cc4294f78d3f74507b7a5f5e7089e71d193cc61)), closes [#117](https://github.com/stinalina/remember-me/issues/117)


### fix

* **NOTIFY-194:** prevent adding duplicated user to DB and introduce mail constraint (#123) ([](https://github.com/stinalina/remember-me/commit/ebdef04e5ac6b3b151c28eca96c1cead175a2705)), closes [#123](https://github.com/stinalina/remember-me/issues/123)
* **NOTIFY-195:** remove dripple run on closed ([](https://github.com/stinalina/remember-me/commit/7c177b79b6425c2f7ba646cfa88bdced4738792f))
* **NOTIFY-206:** change eol for batch scripts #119 ([](https://github.com/stinalina/remember-me/commit/cce0ce162d9c637dcdabe338550cdd766ae24f15)), closes [#119](https://github.com/stinalina/remember-me/issues/119)
* **NOTIFY-208:** solve conflict between dialog focus trap and bitworden by adding data-bwignore attribut for input #118 ([](https://github.com/stinalina/remember-me/commit/87178310340c63de4c495e3d54c47f723e0dcf80)), closes [#118](https://github.com/stinalina/remember-me/issues/118)


### style

* **NOTIFY-204:** preload ttfs for icons (#120) ([](https://github.com/stinalina/remember-me/commit/c7a6ede30da227190fcae229e0454348fea559e2)), closes [#120](https://github.com/stinalina/remember-me/issues/120)
* **NOTIFY-205:** adjust heading sizes (#121) ([](https://github.com/stinalina/remember-me/commit/f98de5810918f41c0da063d45443465f63c8d57c)), closes [#121](https://github.com/stinalina/remember-me/issues/121)

## [1.1.1](https://github.com/stinalina/remember-me/compare/v1.1.0...v1.1.1) (2026-06-18)


### fix

* **NOTIFY-195:** only start deployment when release notes workflow completed (#115) ([](https://github.com/stinalina/remember-me/commit/6e56bf079c64ba139b697641a02bd66ce6a42ff9)), closes [#115](https://github.com/stinalina/remember-me/issues/115)
* **NOTIFY-199:** revert condition ([](https://github.com/stinalina/remember-me/commit/25ff8a12d99243fb5223cb3f1adf0b8aa1774616))
* **NOTIFY-199:** show nothing when there is no note available yet for timeline (#113) ([](https://github.com/stinalina/remember-me/commit/38af6e58cae80da1f15cac0cd6ed0673acce01dc)), closes [#113](https://github.com/stinalina/remember-me/issues/113)
* **NOTIFY-201:** redirect user when registered #112 ([](https://github.com/stinalina/remember-me/commit/4b67860164e32e4dd5b4fdb3563743cd74f49293)), closes [#112](https://github.com/stinalina/remember-me/issues/112)
* **NOTIFY-203:** enable delete archived notes ([](https://github.com/stinalina/remember-me/commit/323dde1a50d94d83c497d9983f1350fe6622b694))


### style

* **NOTIFY-200:** scaling for small devices (#114) ([](https://github.com/stinalina/remember-me/commit/e169b10a24f68247f97f5388d3ce9f72f1df79c9)), closes [#114](https://github.com/stinalina/remember-me/issues/114)

# [1.1.0](https://github.com/stinalina/remember-me/compare/v1.0.0...v1.1.0) (2026-06-17)


* DEPLOYMENT-NOTIFY-192 ([](https://github.com/stinalina/remember-me/commit/819f250bf04daaa4fb07dd7a7d791c971b989219))


### chore

* **NOTIFY-192:** adjust version #108 ([](https://github.com/stinalina/remember-me/commit/15cc5c410754982e119fa8dfdb8a1ada7c70664a)), closes [#108](https://github.com/stinalina/remember-me/issues/108)
* **NOTIFY-192:** fill changelog ([](https://github.com/stinalina/remember-me/commit/a12ced77c821280d5af35914e3d50248ed584f20))


### feat

* **NOTIFY-130:** stats page (#107) ([](https://github.com/stinalina/remember-me/commit/a17db61543d2de156293b7cb2f77723d88e448ab)), closes [#107](https://github.com/stinalina/remember-me/issues/107)
* **NOTIFY-178:** handle old notes, archive or delete (#105) ([](https://github.com/stinalina/remember-me/commit/9a00f19cd55d756234ca7c16d38d03aae1e057ba)), closes [#105](https://github.com/stinalina/remember-me/issues/105)
* **NOTIFY-181:** implement filter for isDraft and add e2e (#103) ([](https://github.com/stinalina/remember-me/commit/8c1610a6c944f83efef5a25b02ca23e8d12a6070)), closes [#103](https://github.com/stinalina/remember-me/issues/103)


### fix

* **NOTIFY-184:** release notes (#102) ([](https://github.com/stinalina/remember-me/commit/a38f9780a0b914281a8b206741ef219113d4048e)), closes [#102](https://github.com/stinalina/remember-me/issues/102)
* **NOTIFY-190:** in draft mode edit is always valid #106 ([](https://github.com/stinalina/remember-me/commit/97277bad794ecf86ba1f1b3c33f49c824ef17eca)), closes [#106](https://github.com/stinalina/remember-me/issues/106)

# 1.0.0 (2026-06-07)


### Bug Fixes

* add missing env var ([1980ce8](https://github.com/stinalina/remember-me/commit/1980ce8d042688f2a187adaeee02b409f85866e5))
* adjust git action for prev environments ([b3dacae](https://github.com/stinalina/remember-me/commit/b3dacaed2f788d6182e5a4e2461d9fcc846b1520))
* adjust port due to posrt conflicts ([aaf9df9](https://github.com/stinalina/remember-me/commit/aaf9df90360a3e3140c8717f74ef2075be463072))
* adjust workflow ([19ec2ea](https://github.com/stinalina/remember-me/commit/19ec2ea96d4efb0fdb8d389603336e1d6d94ce96))
* adjust workflow to new angular version ([b8e364e](https://github.com/stinalina/remember-me/commit/b8e364e65bd0d7623cdbe05b2b0d8be78fd2018e))
* adjustments for PR ([8482546](https://github.com/stinalina/remember-me/commit/8482546a7ae1f6cb623d149ce75ef5e9faa94bc4))
* **NOTIFY-172:** add submit on enter ([5b0a5a8](https://github.com/stinalina/remember-me/commit/5b0a5a844481c73f1a91b7c4c6726bdf7393b3fa))
* close preview environment on close pr ([f2c17d9](https://github.com/stinalina/remember-me/commit/f2c17d9a98574f51f0b24d60da9ea035b25244db))
* csp ([8d8de11](https://github.com/stinalina/remember-me/commit/8d8de115e2ab140f3f5c52e6b68ed388617b0f13))
* env file and workflow ([#36](https://github.com/stinalina/remember-me/issues/36)) ([f1131b6](https://github.com/stinalina/remember-me/commit/f1131b6d847efb49b345ed0d0e06b12f9474e5e0))
* fix deployment file ([064269b](https://github.com/stinalina/remember-me/commit/064269b613e381c1c72203185bf2731398adc137))
* fixes for code review ([1eeda50](https://github.com/stinalina/remember-me/commit/1eeda5092717c8475deb83e286cc9e6c7976196f))
* **NOTIFY-122:** only show isDraft when user is logged in ([#95](https://github.com/stinalina/remember-me/issues/95)) ([7ed11e5](https://github.com/stinalina/remember-me/commit/7ed11e58d8ba8b3586334c14e89a9f9d37cf1003))
* **NOTIFY-165:** use real firebase config ([50f91e5](https://github.com/stinalina/remember-me/commit/50f91e5e188f84fd95a9d57958ec96ce2b4e3bdc))
* **NOTIFY-177:** remove increaseSendedNotificationCount on update ([d25f3ac](https://github.com/stinalina/remember-me/commit/d25f3ac401c60b18351b8b82cd02f2fbeb552eb2))
* **NOTIFY-185:** toast always in foreground ([#101](https://github.com/stinalina/remember-me/issues/101)) ([56a656a](https://github.com/stinalina/remember-me/commit/56a656aa8ec204107caabe3a19c0f629986d1231))
* **NOTIFY-186:** show draft checkbox when user is logged in ([#100](https://github.com/stinalina/remember-me/issues/100)) ([e7d327f](https://github.com/stinalina/remember-me/commit/e7d327f7ca1bdac2c635b7c4479b49595f525255))
* **NOTIFY-27:** use correct api token ([#16](https://github.com/stinalina/remember-me/issues/16)) ([ffb5471](https://github.com/stinalina/remember-me/commit/ffb547118b59c70da286656e28260251486628a6))
* **NOTIFY-57:** move tooltip to bottom to make tab order more comfortable ([be092bf](https://github.com/stinalina/remember-me/commit/be092bfaccd6fe935bc326f11a80a6c271ca4181))
* only write from to sesscionstorage when string is not empty ([d5bce86](https://github.com/stinalina/remember-me/commit/d5bce86ac6b7597f32b847426de804a1a5ef483e))
* remove for attribut in label ([#24](https://github.com/stinalina/remember-me/issues/24)) ([b357b33](https://github.com/stinalina/remember-me/commit/b357b333a2de1a0204c0e684a7ca467900fc0021))
* remove free month hint ([#38](https://github.com/stinalina/remember-me/issues/38)) ([fabdbf0](https://github.com/stinalina/remember-me/commit/fabdbf073b1d3667fd427343475584ee77fe2b77)), closes [#4](https://github.com/stinalina/remember-me/issues/4) [#5](https://github.com/stinalina/remember-me/issues/5) [#6](https://github.com/stinalina/remember-me/issues/6) [#7](https://github.com/stinalina/remember-me/issues/7) [#9](https://github.com/stinalina/remember-me/issues/9) [#11](https://github.com/stinalina/remember-me/issues/11) [#12](https://github.com/stinalina/remember-me/issues/12) [#14](https://github.com/stinalina/remember-me/issues/14) [#16](https://github.com/stinalina/remember-me/issues/16) [#18](https://github.com/stinalina/remember-me/issues/18) [#19](https://github.com/stinalina/remember-me/issues/19) [#20](https://github.com/stinalina/remember-me/issues/20) [#21](https://github.com/stinalina/remember-me/issues/21) [#22](https://github.com/stinalina/remember-me/issues/22) [#24](https://github.com/stinalina/remember-me/issues/24) [#25](https://github.com/stinalina/remember-me/issues/25) [#23](https://github.com/stinalina/remember-me/issues/23) [#27](https://github.com/stinalina/remember-me/issues/27) [#29](https://github.com/stinalina/remember-me/issues/29) [#30](https://github.com/stinalina/remember-me/issues/30) [#31](https://github.com/stinalina/remember-me/issues/31) [#32](https://github.com/stinalina/remember-me/issues/32) [#34](https://github.com/stinalina/remember-me/issues/34) [#36](https://github.com/stinalina/remember-me/issues/36)
* reset form when limit is reached ([#41](https://github.com/stinalina/remember-me/issues/41)) ([2474bca](https://github.com/stinalina/remember-me/commit/2474bca544105bf90a19e789331f0c13cd8e2b1c))
* set height of editor content to 100% ([#18](https://github.com/stinalina/remember-me/issues/18)) ([e872f42](https://github.com/stinalina/remember-me/commit/e872f428b7f554ff98b6ed28d5bf9ffc70f3172f))
* try to fix pipeline ([e693d84](https://github.com/stinalina/remember-me/commit/e693d841248924693b53309b31caf82e6c98fe78))
* url for sending welcome mail ([84e58f0](https://github.com/stinalina/remember-me/commit/84e58f067f608c449bfdcf798ba262077a38ed8f))
* use correct build folder ([1110c82](https://github.com/stinalina/remember-me/commit/1110c82464a8c71a981083aadcd3e62a0e1f47d8))
* use session stoarge not local storage! ([d28c6de](https://github.com/stinalina/remember-me/commit/d28c6de4e68d01ea0d9747435be79cdf51d5e2ff))


### Features

* add e2e ([a090116](https://github.com/stinalina/remember-me/commit/a0901163d897d0035005335c5a9668089f0115b1))
* add firebase ([a3d1ac8](https://github.com/stinalina/remember-me/commit/a3d1ac82dc9e5ce41d914c5e3e1efc1015bd4676))
* add license ([e6c80ed](https://github.com/stinalina/remember-me/commit/e6c80ed42af67c7695829effdb79fb9727516cb3))
* add link to inkedin and git repo ([#43](https://github.com/stinalina/remember-me/issues/43)) ([2a272f6](https://github.com/stinalina/remember-me/commit/2a272f601a17a70c454ebe9505620532d6e4ad1c))
* add logging ([9d6b806](https://github.com/stinalina/remember-me/commit/9d6b806310370f48149eeefe83353c342d703931))
* add mobile not supported ([#76](https://github.com/stinalina/remember-me/issues/76)) ([2c796ec](https://github.com/stinalina/remember-me/commit/2c796ec4dffe91179db9f045c4d83a37bdd20f7f))
* add response design ([#28](https://github.com/stinalina/remember-me/issues/28)) ([6e1d2e2](https://github.com/stinalina/remember-me/commit/6e1d2e29a4aec70cfd920c0f54bfe56a02934e73)), closes [#4](https://github.com/stinalina/remember-me/issues/4) [#5](https://github.com/stinalina/remember-me/issues/5) [#6](https://github.com/stinalina/remember-me/issues/6) [#7](https://github.com/stinalina/remember-me/issues/7) [#9](https://github.com/stinalina/remember-me/issues/9) [#11](https://github.com/stinalina/remember-me/issues/11) [#12](https://github.com/stinalina/remember-me/issues/12) [#14](https://github.com/stinalina/remember-me/issues/14) [#16](https://github.com/stinalina/remember-me/issues/16) [#18](https://github.com/stinalina/remember-me/issues/18) [#19](https://github.com/stinalina/remember-me/issues/19) [#20](https://github.com/stinalina/remember-me/issues/20) [#21](https://github.com/stinalina/remember-me/issues/21) [#22](https://github.com/stinalina/remember-me/issues/22) [#24](https://github.com/stinalina/remember-me/issues/24) [#25](https://github.com/stinalina/remember-me/issues/25) [#23](https://github.com/stinalina/remember-me/issues/23) [#27](https://github.com/stinalina/remember-me/issues/27)
* add slogan spinner ([effc16a](https://github.com/stinalina/remember-me/commit/effc16a875ced2ce3e920a3684f8ed916374bc0b))
* adjust deploy action ([6184d5e](https://github.com/stinalina/remember-me/commit/6184d5e4a2dd32eaa7235225114faebb23d6d989))
* adjust free notification ([865fd04](https://github.com/stinalina/remember-me/commit/865fd047b3807889c5e25e0222397cef5be57a24))
* adjust gitignore for azurite ([9be35f1](https://github.com/stinalina/remember-me/commit/9be35f1d97270c733b60a0807e0101e58c348ba4))
* clean up and restructure ([115e417](https://github.com/stinalina/remember-me/commit/115e4171d6f8d0dc2a6e31da7fe23c2009e63f90))
* connect with Hasura and send notification ([5650343](https://github.com/stinalina/remember-me/commit/5650343c3dd02dafda9a8ee56bf6866aa09d3269))
* delete ununsed own deployment file ([8ff2593](https://github.com/stinalina/remember-me/commit/8ff2593f5601e283fd88e95e3f57442f524be9e7))
* draft of about section and layout improvements ([10955d8](https://github.com/stinalina/remember-me/commit/10955d8f0d3e2344c1702c444efa11e2ff716e2e))
* first draft impressum und placeholder für agb und datenschutz ([ff2ad5d](https://github.com/stinalina/remember-me/commit/ff2ad5d149417028d73f434b7ceca8e2dbd4dbcd))
* first draft of login, registration an ath service ([43e6304](https://github.com/stinalina/remember-me/commit/43e6304e628f9e3919882614bb3ba736951d71a4))
* first draft of toast ([b7809c9](https://github.com/stinalina/remember-me/commit/b7809c9df152b325802d9344b52a21b28907d18e))
* implement routing ([ce52dd3](https://github.com/stinalina/remember-me/commit/ce52dd34da3bc973535aaeec66b6eaf9895e3273))
* improve instructions ([#87](https://github.com/stinalina/remember-me/issues/87)) ([3c1ff22](https://github.com/stinalina/remember-me/commit/3c1ff22eec972d076f60cc07d1b197b08bb12b33))
* improve slogans. ensure every slogan is picked once in random order ([6bc707c](https://github.com/stinalina/remember-me/commit/6bc707c5a0de77a72e8ca4d7af5860cf49ecc255))
* init playwright ([e2fe2f4](https://github.com/stinalina/remember-me/commit/e2fe2f46d53d213378fa66ba7d4e1aca0d0d7db0))
* mvp landing-page ([46292fc](https://github.com/stinalina/remember-me/commit/46292fc4fb5f2ff529a625c4bc3ebd926e727593))
* **notes:** re-enable subject search in notes navbar ([049a01e](https://github.com/stinalina/remember-me/commit/049a01e5fd0b9043b55a2ab0c341af362d6290cc))
* **NOTIFY-104:** remove interessted btn and display login benefits ([7602f00](https://github.com/stinalina/remember-me/commit/7602f00e807dee955523fa68a050f3d4cc1a8260))
* **NOTIFY-110:** increase free limit ([#56](https://github.com/stinalina/remember-me/issues/56)) ([91575b7](https://github.com/stinalina/remember-me/commit/91575b74db71f96f202b16dd230157a6e737e7ac))
* **NOTIFY-110:** remove hasura admim pw from env files [#53](https://github.com/stinalina/remember-me/issues/53) ([34e99eb](https://github.com/stinalina/remember-me/commit/34e99ebd31e0653d0c071c3bf18d6a9f0ea9e3a5))
* **NOTIFY-112:** increase free limit to 5 [#55](https://github.com/stinalina/remember-me/issues/55) ([c4b69b0](https://github.com/stinalina/remember-me/commit/c4b69b09a5bbe22d4eb9a93ae2d32a27e2e97b3b))
* **NOTIFY-113:** created notes counter ([#66](https://github.com/stinalina/remember-me/issues/66)) ([589aefe](https://github.com/stinalina/remember-me/commit/589aefe9242906890bc93ba9a1939a29d6f0d010))
* **NOTIFY-114:** set up firebase [#60](https://github.com/stinalina/remember-me/issues/60) ([240b981](https://github.com/stinalina/remember-me/commit/240b9810ed2e4d9026339cacc82634355015ed6a))
* **NOTIFY-115:** rehydrate login and registration [#61](https://github.com/stinalina/remember-me/issues/61) ([c9e90b9](https://github.com/stinalina/remember-me/commit/c9e90b9e85d640d337282c995c66f568d543fb90))
* **NOTIFY-116:** display notes ([#68](https://github.com/stinalina/remember-me/issues/68)) ([ae56ae5](https://github.com/stinalina/remember-me/commit/ae56ae5f45a77a53a5d4258699164f64db3bc171))
* **NOTIFY-118:** delete notifications ([#71](https://github.com/stinalina/remember-me/issues/71)) ([94945d4](https://github.com/stinalina/remember-me/commit/94945d48642ce1528fd53242cc2b169f3c9710ee))
* **NOTIFY-119:** edit notes ([#73](https://github.com/stinalina/remember-me/issues/73)) ([91e4e8e](https://github.com/stinalina/remember-me/commit/91e4e8ea660512b1b44417978263f96609ed473d))
* **NOTIFY-129:** add member model and allow change avatar ([#69](https://github.com/stinalina/remember-me/issues/69)) ([fafaf9a](https://github.com/stinalina/remember-me/commit/fafaf9a47c52d8efbb3274fe492b6949c9dfda29))
* **NOTIFY-140:** create notes for personal space ([#72](https://github.com/stinalina/remember-me/issues/72)) ([b476260](https://github.com/stinalina/remember-me/commit/b476260d55967b34506a07b1058f0645e4bbddcd))
* **NOTIFY-147:** register user in db and redirect to login ([#70](https://github.com/stinalina/remember-me/issues/70)) ([869a32f](https://github.com/stinalina/remember-me/commit/869a32fdc1d6e03562a4412d981cbfa1625993e3))
* **NOTIFY-148:** mock firebase for e2e ([#74](https://github.com/stinalina/remember-me/issues/74)) ([175c889](https://github.com/stinalina/remember-me/commit/175c889507fc58067df1c0c16dd24d56decc62fc))
* **NOTIFY-150:** rethink project structure ([#86](https://github.com/stinalina/remember-me/issues/86)) ([d3cb584](https://github.com/stinalina/remember-me/commit/d3cb584b88f09f357c8ec463ed5f664635372445))
* **NOTIFY-152:** replace localhost with store prop ([#77](https://github.com/stinalina/remember-me/issues/77)) ([a3ad6b7](https://github.com/stinalina/remember-me/commit/a3ad6b7963db7a474736b3ece198ed07920f30a1))
* **NOTIFY-153:** enable add mail to send the notification ([#78](https://github.com/stinalina/remember-me/issues/78)) ([6bd29cc](https://github.com/stinalina/remember-me/commit/6bd29cc2d2d582001830cc42ae7c7d5f988fbc9b))
* **NOTIFY-1561:** subject search in notes navbar ([c5a5d5a](https://github.com/stinalina/remember-me/commit/c5a5d5acbe6c30e741b18098ef5a88746355e2e0))
* **NOTIFY-157:** enable password reset ([#75](https://github.com/stinalina/remember-me/issues/75)) ([79f549b](https://github.com/stinalina/remember-me/commit/79f549bbdce15aa140f58a2e0a0abe037e871cd0))
* **NOTIFY-161:** UI Feinschliff ([#79](https://github.com/stinalina/remember-me/issues/79)) ([fcaf0d9](https://github.com/stinalina/remember-me/commit/fcaf0d9b540e49607f853b142ced686401427244))
* **NOTIFY-165:** adjust config ([2f66a98](https://github.com/stinalina/remember-me/commit/2f66a982ac5ec075da453d7a1956d664336fc6da))
* **NOTIFY-169:** setup repo for copilot ([#84](https://github.com/stinalina/remember-me/issues/84)) ([bbb1e41](https://github.com/stinalina/remember-me/commit/bbb1e4137502c2fbcb000868d8af0860da3a4d35))
* **NOTIFY-174:** add date to footer ([6143b46](https://github.com/stinalina/remember-me/commit/6143b46649ab3427564664746d35c6b54c22e1f8))
* **NOTIFY-175:** improve avatar dialog by adding more options and resize ([5b01aee](https://github.com/stinalina/remember-me/commit/5b01aee56aeb00e34b16d6e6632250ba0bf1443e))
* **NOTIFY-184:** add link for release notes ([4b52783](https://github.com/stinalina/remember-me/commit/4b5278335a2c11e3ee816e7c8966291a8c239fb5))
* **NOTIFY-27:** deploy to azure static web app ([#15](https://github.com/stinalina/remember-me/issues/15)) ([1f87e41](https://github.com/stinalina/remember-me/commit/1f87e41895f07dc7f042c9e05bd70b810e59fe25))
* **NOTIFY-2:** agb page draft for MVP ([#5](https://github.com/stinalina/remember-me/issues/5)) ([5ce1594](https://github.com/stinalina/remember-me/commit/5ce1594b76e52000e641f7306e13022e466a5640))
* **NOTIFY-35:** route guards for authentication ([#65](https://github.com/stinalina/remember-me/issues/65)) ([6c1f05e](https://github.com/stinalina/remember-me/commit/6c1f05e2071c2acd052d3e82a67650277704726b))
* **NOTIFY-3:** responsive design first draft ([#27](https://github.com/stinalina/remember-me/issues/27)) ([821b03d](https://github.com/stinalina/remember-me/commit/821b03da5eb6351b00eaccf2835c680069a69b53))
* **NOTIFY-40:** layout for signed in users ([#64](https://github.com/stinalina/remember-me/issues/64)) ([02275e5](https://github.com/stinalina/remember-me/commit/02275e585ed44e1fa8f93b44dac28f9e01d206c9))
* **NOTIFY-53:** update angular 20 -> 21 [#59](https://github.com/stinalina/remember-me/issues/59) ([cb94657](https://github.com/stinalina/remember-me/commit/cb946571832e8ff313597b318b8f277a08b9c414))
* **NOTIFY-55:** unit tests and pipeline ([#7](https://github.com/stinalina/remember-me/issues/7)) ([bce8f4c](https://github.com/stinalina/remember-me/commit/bce8f4ca5141b5bcff881cefe23dae606cc2afc4))
* **NOTIFY-58:** introduce vitest and adjust e2e ([#63](https://github.com/stinalina/remember-me/issues/63)) ([6c04049](https://github.com/stinalina/remember-me/commit/6c04049117376d8818aeb407c2875dd4568a2b7e))
* **NOTIFY-59:** add kofi floating widget [#47](https://github.com/stinalina/remember-me/issues/47) ([d161e55](https://github.com/stinalina/remember-me/commit/d161e556ebe04b247b5ca40390ab77a97045f4f0))
* **NOTIFY-62:** introduce landing page ([#62](https://github.com/stinalina/remember-me/issues/62)) ([575ebc7](https://github.com/stinalina/remember-me/commit/575ebc76dddcbde39d2e911b9760e1ce387a860a))
* **NOTIFY-72:** add contact link ([#29](https://github.com/stinalina/remember-me/issues/29)) ([0a8fee5](https://github.com/stinalina/remember-me/commit/0a8fee5464327ae4e12a5f4aeee0677e326141f7))
* **NOTIFY-76:** adjust env files for hasura on azure ([#42](https://github.com/stinalina/remember-me/issues/42)) ([91965fb](https://github.com/stinalina/remember-me/commit/91965fb82a6d547880b0948a1585097158066f4e))
* **NOTIFY-79:** dark mode for debug ([#32](https://github.com/stinalina/remember-me/issues/32)) ([534fe30](https://github.com/stinalina/remember-me/commit/534fe30b7867b0569e19e284b74c9fa77d9368a2))
* **NOTIFY-81:** add interesst btn ([#31](https://github.com/stinalina/remember-me/issues/31)) ([6ce39d4](https://github.com/stinalina/remember-me/commit/6ce39d410e74ce95f63ef6aa6854a0cf24ee8d1e))
* **NOTIFY-81:** Interesse bekunden Btn ([#33](https://github.com/stinalina/remember-me/issues/33)) ([62b1b97](https://github.com/stinalina/remember-me/commit/62b1b975c1c90a410878ed01c9b0db9fcb7ef83b)), closes [#4](https://github.com/stinalina/remember-me/issues/4) [#5](https://github.com/stinalina/remember-me/issues/5) [#6](https://github.com/stinalina/remember-me/issues/6) [#7](https://github.com/stinalina/remember-me/issues/7) [#9](https://github.com/stinalina/remember-me/issues/9) [#11](https://github.com/stinalina/remember-me/issues/11) [#12](https://github.com/stinalina/remember-me/issues/12) [#14](https://github.com/stinalina/remember-me/issues/14) [#16](https://github.com/stinalina/remember-me/issues/16) [#18](https://github.com/stinalina/remember-me/issues/18) [#19](https://github.com/stinalina/remember-me/issues/19) [#20](https://github.com/stinalina/remember-me/issues/20) [#21](https://github.com/stinalina/remember-me/issues/21) [#22](https://github.com/stinalina/remember-me/issues/22) [#24](https://github.com/stinalina/remember-me/issues/24) [#25](https://github.com/stinalina/remember-me/issues/25) [#23](https://github.com/stinalina/remember-me/issues/23) [#27](https://github.com/stinalina/remember-me/issues/27) [#29](https://github.com/stinalina/remember-me/issues/29) [#30](https://github.com/stinalina/remember-me/issues/30) [#31](https://github.com/stinalina/remember-me/issues/31) [#32](https://github.com/stinalina/remember-me/issues/32)
* **NOTIFY-84:** rework for first deployment ([#34](https://github.com/stinalina/remember-me/issues/34)) ([361dec2](https://github.com/stinalina/remember-me/commit/361dec21d662c0fc91c9aebe6d267330d463fd24))
* **NOTIFY-90:** add hidden input for bot detection - honeypot [#50](https://github.com/stinalina/remember-me/issues/50) ([99d108f](https://github.com/stinalina/remember-me/commit/99d108f772d5d71a21dcec2c55985b852b0aa03b))
* **NOTIFY-93:** update readme ([ffe86de](https://github.com/stinalina/remember-me/commit/ffe86de994c2f4fab0a492672c71592fc2ce9943))
* **NOTIFY-96:** add support for anonym user and use bearer token for hasura ([#67](https://github.com/stinalina/remember-me/issues/67)) ([91f1573](https://github.com/stinalina/remember-me/commit/91f1573560cdfd5db579b536f423d5dff319daa1))
* **NOTIFY:** deployment mvp ([#54](https://github.com/stinalina/remember-me/issues/54)) ([2234219](https://github.com/stinalina/remember-me/commit/22342198fc1da36d490ea964dcd2846fa1040d25))
* only send welcome msg if user is new create ([c1dc8bc](https://github.com/stinalina/remember-me/commit/c1dc8bc83ba62c705efc13e0b834b3eae9ea96cf))
* placeholder animation ([7390f5a](https://github.com/stinalina/remember-me/commit/7390f5a260c94870ca8b67f3e2ffe4283233ae9b))
* ready for first prerelease with prev environment ([#37](https://github.com/stinalina/remember-me/issues/37)) ([0f6ec61](https://github.com/stinalina/remember-me/commit/0f6ec6100ace02eaf08f6ffc67d9fce3ef4bcc8d)), closes [#4](https://github.com/stinalina/remember-me/issues/4) [#5](https://github.com/stinalina/remember-me/issues/5) [#6](https://github.com/stinalina/remember-me/issues/6) [#7](https://github.com/stinalina/remember-me/issues/7) [#9](https://github.com/stinalina/remember-me/issues/9) [#11](https://github.com/stinalina/remember-me/issues/11) [#12](https://github.com/stinalina/remember-me/issues/12) [#14](https://github.com/stinalina/remember-me/issues/14) [#16](https://github.com/stinalina/remember-me/issues/16) [#18](https://github.com/stinalina/remember-me/issues/18) [#19](https://github.com/stinalina/remember-me/issues/19) [#20](https://github.com/stinalina/remember-me/issues/20) [#21](https://github.com/stinalina/remember-me/issues/21) [#22](https://github.com/stinalina/remember-me/issues/22) [#24](https://github.com/stinalina/remember-me/issues/24) [#25](https://github.com/stinalina/remember-me/issues/25) [#23](https://github.com/stinalina/remember-me/issues/23) [#27](https://github.com/stinalina/remember-me/issues/27) [#29](https://github.com/stinalina/remember-me/issues/29) [#30](https://github.com/stinalina/remember-me/issues/30) [#31](https://github.com/stinalina/remember-me/issues/31) [#32](https://github.com/stinalina/remember-me/issues/32) [#34](https://github.com/stinalina/remember-me/issues/34) [#36](https://github.com/stinalina/remember-me/issues/36)
* remove hint with free features ([1f8760d](https://github.com/stinalina/remember-me/commit/1f8760d1f3d0b6894a5bc26eed9e7bb26da73dfd))
* remove mvp from env files ([2acf59a](https://github.com/stinalina/remember-me/commit/2acf59a66e5929051e29c0ac80bf4ac0ae38227f))
* send welcome mail with full user ([11d9844](https://github.com/stinalina/remember-me/commit/11d9844097c11e50f3163069f5b233766a5ae088))
* send welcome message ([0d3fbc4](https://github.com/stinalina/remember-me/commit/0d3fbc40a662b0dd8c985e78c7e30b98f937af2a))
* setup skeleton, tailwind and daisyUI ([37eda3f](https://github.com/stinalina/remember-me/commit/37eda3f0937b77d50edc3698b26e74fc7eef60c3))
* update angular 20 -> 21 ([196e2f3](https://github.com/stinalina/remember-me/commit/196e2f3ae97854befe556e3fef4fde74061b0289))
* use local stoarge to save draft ([01ccedb](https://github.com/stinalina/remember-me/commit/01ccedbef422d8a1662d0c5ab9aa8d1a00562614))
* when user is not in DB it will be created and then add notfication to db ([0211999](https://github.com/stinalina/remember-me/commit/0211999993da7aa5b60308e46ce0ecaf88767197))
