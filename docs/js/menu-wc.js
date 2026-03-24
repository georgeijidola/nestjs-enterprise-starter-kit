'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">nestjs-enterprise-starter-kit documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/ApiKeyModule.html" data-type="entity-link" >ApiKeyModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ApiKeyModule-dda6e03785ff7d9190331693dbef438f2736a7e6e76aa40cccce4d212555fc95ea7bde664c88ad6324d7cab6611583d8e1dac3ac1e84ef1330ac075f075dafd8"' : 'data-bs-target="#xs-controllers-links-module-ApiKeyModule-dda6e03785ff7d9190331693dbef438f2736a7e6e76aa40cccce4d212555fc95ea7bde664c88ad6324d7cab6611583d8e1dac3ac1e84ef1330ac075f075dafd8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ApiKeyModule-dda6e03785ff7d9190331693dbef438f2736a7e6e76aa40cccce4d212555fc95ea7bde664c88ad6324d7cab6611583d8e1dac3ac1e84ef1330ac075f075dafd8"' :
                                            'id="xs-controllers-links-module-ApiKeyModule-dda6e03785ff7d9190331693dbef438f2736a7e6e76aa40cccce4d212555fc95ea7bde664c88ad6324d7cab6611583d8e1dac3ac1e84ef1330ac075f075dafd8"' }>
                                            <li class="link">
                                                <a href="controllers/ApiKeyController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiKeyController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ApiKeyModule-dda6e03785ff7d9190331693dbef438f2736a7e6e76aa40cccce4d212555fc95ea7bde664c88ad6324d7cab6611583d8e1dac3ac1e84ef1330ac075f075dafd8"' : 'data-bs-target="#xs-injectables-links-module-ApiKeyModule-dda6e03785ff7d9190331693dbef438f2736a7e6e76aa40cccce4d212555fc95ea7bde664c88ad6324d7cab6611583d8e1dac3ac1e84ef1330ac075f075dafd8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ApiKeyModule-dda6e03785ff7d9190331693dbef438f2736a7e6e76aa40cccce4d212555fc95ea7bde664c88ad6324d7cab6611583d8e1dac3ac1e84ef1330ac075f075dafd8"' :
                                        'id="xs-injectables-links-module-ApiKeyModule-dda6e03785ff7d9190331693dbef438f2736a7e6e76aa40cccce4d212555fc95ea7bde664c88ad6324d7cab6611583d8e1dac3ac1e84ef1330ac075f075dafd8"' }>
                                        <li class="link">
                                            <a href="injectables/ApiKeyService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiKeyService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-0ab0feb0fb397b285fca34b867e33a28851a5c181a4a0633d76687622c0530b2fb4d90c688dfcf7bd6cce89b6686a712daf8ce4c1583335cd6c7f849e3d700e5"' : 'data-bs-target="#xs-controllers-links-module-AppModule-0ab0feb0fb397b285fca34b867e33a28851a5c181a4a0633d76687622c0530b2fb4d90c688dfcf7bd6cce89b6686a712daf8ce4c1583335cd6c7f849e3d700e5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-0ab0feb0fb397b285fca34b867e33a28851a5c181a4a0633d76687622c0530b2fb4d90c688dfcf7bd6cce89b6686a712daf8ce4c1583335cd6c7f849e3d700e5"' :
                                            'id="xs-controllers-links-module-AppModule-0ab0feb0fb397b285fca34b867e33a28851a5c181a4a0633d76687622c0530b2fb4d90c688dfcf7bd6cce89b6686a712daf8ce4c1583335cd6c7f849e3d700e5"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/HealthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HealthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-0ab0feb0fb397b285fca34b867e33a28851a5c181a4a0633d76687622c0530b2fb4d90c688dfcf7bd6cce89b6686a712daf8ce4c1583335cd6c7f849e3d700e5"' : 'data-bs-target="#xs-injectables-links-module-AppModule-0ab0feb0fb397b285fca34b867e33a28851a5c181a4a0633d76687622c0530b2fb4d90c688dfcf7bd6cce89b6686a712daf8ce4c1583335cd6c7f849e3d700e5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-0ab0feb0fb397b285fca34b867e33a28851a5c181a4a0633d76687622c0530b2fb4d90c688dfcf7bd6cce89b6686a712daf8ce4c1583335cd6c7f849e3d700e5"' :
                                        'id="xs-injectables-links-module-AppModule-0ab0feb0fb397b285fca34b867e33a28851a5c181a4a0633d76687622c0530b2fb4d90c688dfcf7bd6cce89b6686a712daf8ce4c1583335cd6c7f849e3d700e5"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuditModule.html" data-type="entity-link" >AuditModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuditModule-c27ccde9d58c41aa9cf2195a4765b2e5115848bfe37262c03bb130db81d16440beb6897779ef7b27ebb6337619032d72a659d78ee5ce6767d41a9d58df10dc31"' : 'data-bs-target="#xs-controllers-links-module-AuditModule-c27ccde9d58c41aa9cf2195a4765b2e5115848bfe37262c03bb130db81d16440beb6897779ef7b27ebb6337619032d72a659d78ee5ce6767d41a9d58df10dc31"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuditModule-c27ccde9d58c41aa9cf2195a4765b2e5115848bfe37262c03bb130db81d16440beb6897779ef7b27ebb6337619032d72a659d78ee5ce6767d41a9d58df10dc31"' :
                                            'id="xs-controllers-links-module-AuditModule-c27ccde9d58c41aa9cf2195a4765b2e5115848bfe37262c03bb130db81d16440beb6897779ef7b27ebb6337619032d72a659d78ee5ce6767d41a9d58df10dc31"' }>
                                            <li class="link">
                                                <a href="controllers/AuditController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuditController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuditModule-c27ccde9d58c41aa9cf2195a4765b2e5115848bfe37262c03bb130db81d16440beb6897779ef7b27ebb6337619032d72a659d78ee5ce6767d41a9d58df10dc31"' : 'data-bs-target="#xs-injectables-links-module-AuditModule-c27ccde9d58c41aa9cf2195a4765b2e5115848bfe37262c03bb130db81d16440beb6897779ef7b27ebb6337619032d72a659d78ee5ce6767d41a9d58df10dc31"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuditModule-c27ccde9d58c41aa9cf2195a4765b2e5115848bfe37262c03bb130db81d16440beb6897779ef7b27ebb6337619032d72a659d78ee5ce6767d41a9d58df10dc31"' :
                                        'id="xs-injectables-links-module-AuditModule-c27ccde9d58c41aa9cf2195a4765b2e5115848bfe37262c03bb130db81d16440beb6897779ef7b27ebb6337619032d72a659d78ee5ce6767d41a9d58df10dc31"' }>
                                        <li class="link">
                                            <a href="injectables/AuditService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuditService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-9979741307a64bcad456052d56e64682444b56864f85c2a7b9444c296c37fce7c549f25839ebfbb0590d960449041f411daf77bee1c68b2327958c1206c6ecdf"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-9979741307a64bcad456052d56e64682444b56864f85c2a7b9444c296c37fce7c549f25839ebfbb0590d960449041f411daf77bee1c68b2327958c1206c6ecdf"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-9979741307a64bcad456052d56e64682444b56864f85c2a7b9444c296c37fce7c549f25839ebfbb0590d960449041f411daf77bee1c68b2327958c1206c6ecdf"' :
                                            'id="xs-controllers-links-module-AuthModule-9979741307a64bcad456052d56e64682444b56864f85c2a7b9444c296c37fce7c549f25839ebfbb0590d960449041f411daf77bee1c68b2327958c1206c6ecdf"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-9979741307a64bcad456052d56e64682444b56864f85c2a7b9444c296c37fce7c549f25839ebfbb0590d960449041f411daf77bee1c68b2327958c1206c6ecdf"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-9979741307a64bcad456052d56e64682444b56864f85c2a7b9444c296c37fce7c549f25839ebfbb0590d960449041f411daf77bee1c68b2327958c1206c6ecdf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-9979741307a64bcad456052d56e64682444b56864f85c2a7b9444c296c37fce7c549f25839ebfbb0590d960449041f411daf77bee1c68b2327958c1206c6ecdf"' :
                                        'id="xs-injectables-links-module-AuthModule-9979741307a64bcad456052d56e64682444b56864f85c2a7b9444c296c37fce7c549f25839ebfbb0590d960449041f411daf77bee1c68b2327958c1206c6ecdf"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CommonModule.html" data-type="entity-link" >CommonModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CommonModule-be7ad1c0754076c035423d4b4e7ec332268460fc4bc16d824c5e43a89ad999e59b5e2a9cf77d400344b050c4e247d57e99465031de5e1de29e37245e3a3bebc1"' : 'data-bs-target="#xs-injectables-links-module-CommonModule-be7ad1c0754076c035423d4b4e7ec332268460fc4bc16d824c5e43a89ad999e59b5e2a9cf77d400344b050c4e247d57e99465031de5e1de29e37245e3a3bebc1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CommonModule-be7ad1c0754076c035423d4b4e7ec332268460fc4bc16d824c5e43a89ad999e59b5e2a9cf77d400344b050c4e247d57e99465031de5e1de29e37245e3a3bebc1"' :
                                        'id="xs-injectables-links-module-CommonModule-be7ad1c0754076c035423d4b4e7ec332268460fc4bc16d824c5e43a89ad999e59b5e2a9cf77d400344b050c4e247d57e99465031de5e1de29e37245e3a3bebc1"' }>
                                        <li class="link">
                                            <a href="injectables/ApiKeyService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiKeyService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AppConfiguration.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppConfiguration</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuditService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuditService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthMiddleware.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthMiddleware</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthenticationUtilityService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthenticationUtilityService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CacheService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CacheService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/HealthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HealthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RedisHealthIndicator.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RedisHealthIndicator</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ServerHealthIndicator.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ServerHealthIndicator</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DomainModule.html" data-type="entity-link" >DomainModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LoadersModule.html" data-type="entity-link" >LoadersModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-LoadersModule-d6ec3fc45f55566ed749f5d46f2e288bb3576b1cd9440fe749ac1c4521001390da24eb03f61c2dff0ed267fb124f5f3199f0f7d688dcd9db86f932a63ce3567a"' : 'data-bs-target="#xs-injectables-links-module-LoadersModule-d6ec3fc45f55566ed749f5d46f2e288bb3576b1cd9440fe749ac1c4521001390da24eb03f61c2dff0ed267fb124f5f3199f0f7d688dcd9db86f932a63ce3567a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LoadersModule-d6ec3fc45f55566ed749f5d46f2e288bb3576b1cd9440fe749ac1c4521001390da24eb03f61c2dff0ed267fb124f5f3199f0f7d688dcd9db86f932a63ce3567a"' :
                                        'id="xs-injectables-links-module-LoadersModule-d6ec3fc45f55566ed749f5d46f2e288bb3576b1cd9440fe749ac1c4521001390da24eb03f61c2dff0ed267fb124f5f3199f0f7d688dcd9db86f932a63ce3567a"' }>
                                        <li class="link">
                                            <a href="injectables/AppConfiguration.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppConfiguration</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/QueuesModule.html" data-type="entity-link" >QueuesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-QueuesModule-a79d18dba1da7e6c077660e3c71298f6c404c33bc4f2381c0d6d316166f32ce81b10d7dacb25be3e46fc998b7ad28fdd52026a62993ccc830cd1c44de2ed2edf"' : 'data-bs-target="#xs-injectables-links-module-QueuesModule-a79d18dba1da7e6c077660e3c71298f6c404c33bc4f2381c0d6d316166f32ce81b10d7dacb25be3e46fc998b7ad28fdd52026a62993ccc830cd1c44de2ed2edf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-QueuesModule-a79d18dba1da7e6c077660e3c71298f6c404c33bc4f2381c0d6d316166f32ce81b10d7dacb25be3e46fc998b7ad28fdd52026a62993ccc830cd1c44de2ed2edf"' :
                                        'id="xs-injectables-links-module-QueuesModule-a79d18dba1da7e6c077660e3c71298f6c404c33bc4f2381c0d6d316166f32ce81b10d7dacb25be3e46fc998b7ad28fdd52026a62993ccc830cd1c44de2ed2edf"' }>
                                        <li class="link">
                                            <a href="injectables/QueueService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueueService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-ecdaabc86ec0061771b2326b6fb208c29ea00dc2fb5e061e5d7baeeaf6ed09385bbfac43a3fd50fcccf01c5f981708fec7e2a4961094b84625ec01fd47aa16af"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-ecdaabc86ec0061771b2326b6fb208c29ea00dc2fb5e061e5d7baeeaf6ed09385bbfac43a3fd50fcccf01c5f981708fec7e2a4961094b84625ec01fd47aa16af"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-ecdaabc86ec0061771b2326b6fb208c29ea00dc2fb5e061e5d7baeeaf6ed09385bbfac43a3fd50fcccf01c5f981708fec7e2a4961094b84625ec01fd47aa16af"' :
                                            'id="xs-controllers-links-module-UsersModule-ecdaabc86ec0061771b2326b6fb208c29ea00dc2fb5e061e5d7baeeaf6ed09385bbfac43a3fd50fcccf01c5f981708fec7e2a4961094b84625ec01fd47aa16af"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-ecdaabc86ec0061771b2326b6fb208c29ea00dc2fb5e061e5d7baeeaf6ed09385bbfac43a3fd50fcccf01c5f981708fec7e2a4961094b84625ec01fd47aa16af"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-ecdaabc86ec0061771b2326b6fb208c29ea00dc2fb5e061e5d7baeeaf6ed09385bbfac43a3fd50fcccf01c5f981708fec7e2a4961094b84625ec01fd47aa16af"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-ecdaabc86ec0061771b2326b6fb208c29ea00dc2fb5e061e5d7baeeaf6ed09385bbfac43a3fd50fcccf01c5f981708fec7e2a4961094b84625ec01fd47aa16af"' :
                                        'id="xs-injectables-links-module-UsersModule-ecdaabc86ec0061771b2326b6fb208c29ea00dc2fb5e061e5d7baeeaf6ed09385bbfac43a3fd50fcccf01c5f981708fec7e2a4961094b84625ec01fd47aa16af"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AllExceptionFilter.html" data-type="entity-link" >AllExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApiKeyListResponseDto.html" data-type="entity-link" >ApiKeyListResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApiKeyResponseDto.html" data-type="entity-link" >ApiKeyResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuditLogFiltersDto.html" data-type="entity-link" >AuditLogFiltersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoriesResponse.html" data-type="entity-link" >CategoriesResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoryDto.html" data-type="entity-link" >CategoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateApiKeyDto.html" data-type="entity-link" >CreateApiKeyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateApiKeyResponseDto.html" data-type="entity-link" >CreateApiKeyResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAuditLogDto.html" data-type="entity-link" >CreateAuditLogDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatedByDto.html" data-type="entity-link" >CreatedByDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateWhitelistEntryDto.html" data-type="entity-link" >CreateWhitelistEntryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CursorPaginationQueryDto.html" data-type="entity-link" >CursorPaginationQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CursorPaginationUtil.html" data-type="entity-link" >CursorPaginationUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorResponse.html" data-type="entity-link" >ErrorResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/FailedFileUploadDto.html" data-type="entity-link" >FailedFileUploadDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileUploadResponseDto.html" data-type="entity-link" >FileUploadResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileValidationUtil.html" data-type="entity-link" >FileValidationUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/MetaDto.html" data-type="entity-link" >MetaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MultipartUtil.html" data-type="entity-link" >MultipartUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/MultipleFileUploadResponseDto.html" data-type="entity-link" >MultipleFileUploadResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationLinks.html" data-type="entity-link" >PaginationLinks</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationMeta.html" data-type="entity-link" >PaginationMeta</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordMatchValidator.html" data-type="entity-link" >PasswordMatchValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordUtil.html" data-type="entity-link" >PasswordUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/Response.html" data-type="entity-link" >Response</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignInDto.html" data-type="entity-link" >SignInDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpDto.html" data-type="entity-link" >SignUpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SuccessResponse.html" data-type="entity-link" >SuccessResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateApiKeyDto.html" data-type="entity-link" >UpdateApiKeyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadFileDto.html" data-type="entity-link" >UploadFileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserExistenceUtil.html" data-type="entity-link" >UserExistenceUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/WhitelistEntryResponseDto.html" data-type="entity-link" >WhitelistEntryResponseDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ExecutionTimeInterceptor.html" data-type="entity-link" >ExecutionTimeInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileStorageService.html" data-type="entity-link" >FileStorageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoggingService.html" data-type="entity-link" >LoggingService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/ApiKeyGuard.html" data-type="entity-link" >ApiKeyGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CursorPaginationOptions.html" data-type="entity-link" >CursorPaginationOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataProcessingJob.html" data-type="entity-link" >DataProcessingJob</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DownloadOptions.html" data-type="entity-link" >DownloadOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EmailJob.html" data-type="entity-link" >EmailJob</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileUploadResult.html" data-type="entity-link" >FileUploadResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Log.html" data-type="entity-link" >Log</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MultipleFileUploadResult.html" data-type="entity-link" >MultipleFileUploadResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginatedResult.html" data-type="entity-link" >PaginatedResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginationMeta.html" data-type="entity-link" >PaginationMeta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ParsedMultipartData.html" data-type="entity-link" >ParsedMultipartData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PrismaModel.html" data-type="entity-link" >PrismaModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SortOption.html" data-type="entity-link" >SortOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadOptions.html" data-type="entity-link" >UploadOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ValidatedFile.html" data-type="entity-link" >ValidatedFile</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});