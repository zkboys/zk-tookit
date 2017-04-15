import * as PagesBaseInformationBusinessUserAdd from './../pages/base-information/business-user/Add';
import * as PagesBaseInformationBusinessUserIndex from './../pages/base-information/business-user/Index';
import * as PagesBaseInformationManagerAddEdit from './../pages/base-information/manager/AddEdit';
import * as PagesBaseInformationManagerIndex from './../pages/base-information/manager/Index';
import * as PagesBaseInformationRoleIndex from './../pages/base-information/role/Index';
import * as PagesErrorError401 from './../pages/error/Error401';
import * as PagesErrorError403 from './../pages/error/Error403';
import * as PagesPagePage2 from './../pages/page/Page2';

export default {
    [PagesBaseInformationBusinessUserAdd.PAGE_SCOPE]: PagesBaseInformationBusinessUserAdd.INIT_STATE,
    [PagesBaseInformationBusinessUserIndex.PAGE_SCOPE]: PagesBaseInformationBusinessUserIndex.INIT_STATE,
    [PagesBaseInformationManagerAddEdit.PAGE_SCOPE]: PagesBaseInformationManagerAddEdit.INIT_STATE,
    [PagesBaseInformationManagerIndex.PAGE_SCOPE]: PagesBaseInformationManagerIndex.INIT_STATE,
    [PagesBaseInformationRoleIndex.PAGE_SCOPE]: PagesBaseInformationRoleIndex.INIT_STATE,
    [PagesErrorError401.PAGE_SCOPE]: PagesErrorError401.INIT_STATE,
    [PagesErrorError403.PAGE_SCOPE]: PagesErrorError403.INIT_STATE,
    [PagesPagePage2.PAGE_SCOPE]: PagesPagePage2.INIT_STATE
};
