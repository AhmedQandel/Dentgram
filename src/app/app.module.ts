import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { FavHome } from '../pages/fav-home/fav-home';
import { FavCoursesListPage } from '../pages/fav-list-courses/dr-fav-list-courses';
import { BuySellMainPage } from '../pages/buy-sell-main/buy-sell-main';
import { ItemDetailsPage } from "../pages/item-details/item-details";
import { CategorysPage } from "../pages/categorys/categorys";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Http, HttpModule } from '@angular/http';
import { MainFunctionsProvider } from '../providers/main-functions/main-functions';

import { AccountPage } from "../pages/account/account";
import { AuthCreatePage } from "../pages/auth-create/auth-create";
import { AuthLoginPage } from "../pages/auth-login/auth-login";
import { BrandsPage } from "../pages/brands/brands";
import { BrandsStoresPage } from "../pages/brands-stores/brands-stores";
import { FaqPage } from "../pages/faq/faq";
import { StoresPage } from "../pages/stores/stores";
import { UsedPage } from "../pages/used/used";
import { AccAddressPage } from "../pages/acc-address/acc-address";
import { AccContactUsPage } from "../pages/acc-contact-us/acc-contact-us";
import { AccFavPage } from "../pages/acc-fav/acc-fav";
import { NewsPage } from "../pages/news-page/news-page";
import { AccInfoPage } from "../pages/acc-info/acc-info";
import { AccOrdersPage } from "../pages/acc-orders/acc-orders";
import { AuthSignoutPage } from "../pages/auth-signout/auth-signout";
import { UsedAddPage } from "../pages/used-add/used-add";
import { UsedAdsPage } from "../pages/used-ads/used-ads";
import { UsedFavPage } from "../pages/used-fav/used-fav";
import { UsedMyadsPage } from "../pages/used-myads/used-myads";
import { UsedMsgPage } from "../pages/used-msg/used-msg";


import { CatalogueMainPage } from "../pages/catalogue-main/catalogue-main";
import { CatalogueSubMainPage } from "../pages/catalogue-sub-main/catalogue-sub-main";

import { BuyCategoriesPage } from "../pages/buy-categories/buy-categories";
import { BuyCategoriesSubPage } from "../pages/buy-categories-sub/buy-categories-sub";
import { BuyBrowseProductsPage } from "../pages/buy-browse-products/buy-browse-products";


import { CoursesCategoriesPage } from "../pages/courses-categories/courses-categories";
import { CoursesListPage } from "../pages/courses-list/courses-list";
import { CoursesDetailsPage } from "../pages/courses-details/courses-details";

import { BooksCategoriesPage } from "../pages/books-categories/books-categories";
import { BooksListPage } from "../pages/books-list/books-list";
import { BooksDetailsPage } from "../pages/books-details/books-details";

import { CalenderPage } from "../pages/calender/calender";

import { MatchMakingPage } from "../pages/match-making/match-making";

import { LanguageSelectPage } from "../pages/language-select/language-select";

import { IonicStorageModule } from '@ionic/storage';

import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AccountfPage } from "../pages/accountf/accountf";
import { AccCartPage } from "../pages/acc-cart/acc-cart";

import { CoursesPage } from "../pages/courses/courses";
import { TechniciansPage } from "../pages/technicians/technicians";
import { ElearningPage } from "../pages/elearning/elearning";
import { BlogPage } from "../pages/blog/blog";
import { AuthProvider } from '../providers/auth/auth';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { Facebook } from '@ionic-native/facebook';

import { DatePipe } from '@angular/common'
import { ConnectivityServiceProvider } from '../providers/connectivity-service/connectivity-service';

import { NoConnectivityPage } from "../pages/no-connectivity/no-connectivity";

import { Network } from '@ionic-native/network';

import { PhotoViewer } from '@ionic-native/photo-viewer';

import { ItemDetailsStorePage } from '../pages/item-details-store/item-details-store';

import { MatchMakingListPage } from "../pages/match-making-list/match-making-list";
import { MatchMakingDetailsPage } from "../pages/match-making-details/match-making-details";
import { MatchMakingApplyPage } from "../pages/match-making-apply/match-making-apply";

import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import { SearchPage } from "../pages/search/search";
import { SearchResultPage } from "../pages/search-result/search-result";
import { DataProvider } from '../providers/data/data';
import { LibraryDetailsPage } from "../pages/library-details/library-details";
import { NewsDetailsPage } from "../pages/news-details/news-details";


import { UsedAdsSubMenuPage } from "../pages/used-ads-sub-menu/used-ads-sub-menu";
import { UsedAdsListPage } from "../pages/used-ads-list/used-ads-list";
import { UsedAdsDetailsPage } from "../pages/used-ads-details/used-ads-details";


import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

import { FilePath } from '@ionic-native/file-path';
import { Base64 } from '@ionic-native/base64';

import { UploadProvider } from '../providers/upload/upload';

import { UsedMsgesListPage } from "../pages/used-msges-list/used-msges-list";

import { UsedMsgesListDetailsPage } from "../pages/used-msges-list-details/used-msges-list-details";

import { FCM } from '@ionic-native/fcm';

import { FavoritePageEvent } from '../pages/fav-list-events/dr-fav-list-events';

import { SocialSharing } from '@ionic-native/social-sharing';

import { Camera } from '@ionic-native/camera';

import { SafePipe } from '../pip/safe'
// import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';

// import { DocumentViewer } from '@ionic-native/document-viewer';
import { FileOpener } from '@ionic-native/file-opener';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FavHome,
    FavCoursesListPage,
    FavoritePageEvent,
    BuySellMainPage,
    ItemDetailsPage,
    CategorysPage,
    AccountPage,
    AuthCreatePage,
    AuthLoginPage,
    BrandsPage,
    BrandsStoresPage,
    FaqPage,
    StoresPage,
    UsedPage,
    AccAddressPage,
    AccContactUsPage,
    AccInfoPage,
    AccFavPage,
    NewsPage,
    AccOrdersPage,
    AuthSignoutPage,
    UsedAddPage,
    UsedAdsPage,
    UsedFavPage,
    UsedMyadsPage,
    UsedMsgPage,
    AccountfPage,
    AccCartPage,
    CoursesPage,
    TechniciansPage,
    ElearningPage,
    BlogPage,
    CatalogueMainPage,
    CatalogueSubMainPage,
    BuyCategoriesSubPage,
    BuyCategoriesPage,
    BuyBrowseProductsPage,
    CoursesCategoriesPage,
    CoursesListPage,
    CoursesDetailsPage,
    BooksCategoriesPage,
    BooksListPage,
    BooksDetailsPage,
    CalenderPage,
    MatchMakingPage,
    LanguageSelectPage,
    NoConnectivityPage,
    ItemDetailsStorePage,
    MatchMakingListPage,
    MatchMakingDetailsPage,
    SearchPage,
    SearchResultPage,
    LibraryDetailsPage,
    UsedAdsSubMenuPage,
    UsedAdsListPage,
    UsedAdsDetailsPage,
    MatchMakingApplyPage,
    UsedMsgesListPage,
    UsedMsgesListDetailsPage,
    SafePipe,
    NewsDetailsPage

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: 'ios-arrow-back',
      iconMode: 'md'
    }),
    HttpModule,
    TranslateModule.forRoot({
      loader: {
           provide: TranslateLoader,
           useFactory: (createTranslateLoader),
           deps: [Http]
         }
      }),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FavHome,
    FavCoursesListPage,
    FavoritePageEvent,
    BuySellMainPage,
    ItemDetailsPage,
    CategorysPage,
    AccountPage,
    AuthCreatePage,
    AuthLoginPage,
    BrandsPage,
    BrandsStoresPage,
    FaqPage,
    StoresPage,
    UsedPage,
    AccAddressPage,
    AccContactUsPage,
    AccInfoPage,
    AccFavPage,
    NewsPage,
    AccOrdersPage,
    AuthSignoutPage,
    UsedAddPage,
    UsedAdsPage,
    UsedFavPage,
    UsedMyadsPage,
    UsedMsgPage,
    AccountfPage,
    AccCartPage,
    CoursesPage,
    TechniciansPage,
    ElearningPage,
    BlogPage,
    CatalogueMainPage,
    CatalogueSubMainPage,
    BuyCategoriesSubPage,
    BuyCategoriesPage,
    BuyBrowseProductsPage,
    CoursesCategoriesPage,
    CoursesListPage,
    CoursesDetailsPage,
    BooksCategoriesPage,
    BooksListPage,
    BooksDetailsPage,
    CalenderPage,
    MatchMakingPage,
    LanguageSelectPage,
    NoConnectivityPage,
    ItemDetailsStorePage,
    MatchMakingListPage,
    MatchMakingDetailsPage,
    SearchPage,
    SearchResultPage,
    LibraryDetailsPage,
    UsedAdsSubMenuPage,
    UsedAdsListPage,
    UsedAdsDetailsPage,
    MatchMakingApplyPage,
    UsedMsgesListPage,
    NewsDetailsPage,
    UsedMsgesListDetailsPage
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    DatePipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MainFunctionsProvider,
    AuthProvider,
    Network,
    PhotoViewer,
    File,
    FCM,
    SocialSharing ,
    YoutubeVideoPlayer,
    FileOpener,
    // DocumentViewer,
    FileTransfer,
    FileChooser,
    Base64,
    FilePath,
    // ImageResizer,
    ConnectivityServiceProvider,
    DataProvider,
    UploadProvider,
    AndroidPermissions,
    Camera
  ],
  exports: [SafePipe]
})
export class AppModule {}
