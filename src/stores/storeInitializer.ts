import RoleStore from './roleStore';
import UserStore from './userStore';
import CampaignsStore from './campaignsStore';
import SessionStore from './sessionStore';
import AuthenticationStore from './authenticationStore';
import DynamicFormStore from './dynamicFormStore';
import ProductsStore from './productsStore';
import ProgramsStore from './programsStore';
import OrdersStore from './ordersStore';
import SupportersStore from './supportersStore';
import ProgramCategoryStore from './programCategoryStore';
import TransferStore from './transferStore';
import ContentStore from './contentStore';
import PointToPointTransferSore from './pointToPointTransferSore';
import CashOutStore from './cashOutStore';
import OrphanSposnorshipCancellationStore from './orphanSposnorshipCancellationStore';
import PermissionStore from './permissionStore';
import NotificationsStore from './notificationsStore';
import ReportsStore from './reportsStore';

export interface IStoreInstances {
  authenticationStore: AuthenticationStore,
  roleStore: RoleStore,
  userStore: UserStore,
  campaignsStore: CampaignsStore,
  sessionStore: SessionStore,
  dynamicFormStore:DynamicFormStore,
  productsStore: ProductsStore,
  programsStore: ProgramsStore,
  ordersStore: OrdersStore,
  supportersStore: SupportersStore,
  programCategoryStore: ProgramCategoryStore,
  transferStore: TransferStore
  contentStore: ContentStore,
  pointToPointTransfer:PointToPointTransferSore,
  cashOutStore:CashOutStore,
  orphanSposnorshipCancellationStore:OrphanSposnorshipCancellationStore,
  permissionStore:PermissionStore,
  notificationStore:NotificationsStore,
  reportsStore:ReportsStore

}
export default function initializeStores(): IStoreInstances {
  return {
    authenticationStore: new AuthenticationStore(),
    roleStore: new RoleStore(),
    userStore: new UserStore(),
    sessionStore: new SessionStore(),
    dynamicFormStore: new DynamicFormStore(),
    campaignsStore: new CampaignsStore(),
    productsStore: new ProductsStore(),
    programsStore: new ProgramsStore(),
    ordersStore: new OrdersStore(),
    supportersStore: new SupportersStore(),
    programCategoryStore: new ProgramCategoryStore(),
    transferStore: new TransferStore(),
    contentStore: new ContentStore(),
    pointToPointTransfer: new PointToPointTransferSore(),
    cashOutStore:new CashOutStore(),
    orphanSposnorshipCancellationStore: new OrphanSposnorshipCancellationStore(),
    permissionStore:new PermissionStore(),
    notificationStore:new NotificationsStore(),
    reportsStore:new ReportsStore()

  };
}
