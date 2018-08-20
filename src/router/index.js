import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/views/login/login'
import Home from '@/components/views/home'
// 自定义TreeView
import MyTree from '@/components/views/common/myTree'
// 修改密码
import UpdatePass from '@/components/views/login/updatePass'
// 菜单管理
import Menu from '@/components/views/system/menu/menu'
// 卡券管理
import CouponList from '@/components/views/coupon/couponList'
import AddCoupon from '@/components/views/coupon/couponAdd'
import EditCoupon from '@/components/views/coupon/couponEdit'
import CouponDetail from '@/components/views/coupon/couponDetail'
import PutOutTicket from '@/components/views/coupon/putOutTicket'
import PutOutTicketAdd from '@/components/views/coupon/PutOutTicketAdd'
// 领取明细
import ReceiveList from '@/components/views/coupon/receiveList'
// 卡券核销
import CouponExchange from '@/components/views/coupon/couponExchange'
// 批量制卡
import LotsCoupon from '@/components/views/coupon/lotsCoupon'
import LotsCouponCreate from '@/components/views/coupon/lotsCouponCreate'
import LotsCouponDetail from '@/components/views/coupon/lotsCouponDetail'
// 卡券有效期设定
import CouponDateSet from '@/components/views/coupon/couponDateSet'
// 会员管理
import Benefit from '@/components/views/member/benefit'
import EditBenefit from '@/components/views/member/benefitEdit'
import PointConfig from '@/components/views/member/pointConfig'
import MemberInformation from '@/components/views/member/memberInformation'
import MemberInformationDetail from '@/components/views/member/MemberInformationDetail'
import MemberInformationEdit from '@/components/views/member/MemberInformationEdit'
// import MemberPoint from '@/components/views/member/memberPoint'
import MemberPointEdit from '@/components/views/member/memberPointEdit'
// 编辑器
import VueEditor from '@/components/views/common/editor.vue'
// 员工管理
import EmployeeList from '@/components/views/system/employee/employeeList'
import EmployeeAdd from '@/components/views/system/employee/employeeAdd'
import EmployeeDetail from '@/components/views/system/employee/employeeDetail'
import EmployeeEdit from '@/components/views/system/employee/employeeEdit'
// 佣金管理
import ChargeList from '@/components/views/system/charges/chargeList'
import ChargeAdd from '@/components/views/system/charges/chargeAdd'
import ChargeUpdate from '@/components/views/system/charges/chargeUpdate'
// 门店管理
import StoreMsg from '@/components/views/store/storeMsg'
import StoreHoliday from '@/components/views/store/storeHoliday'
import StoreHolidayEdit from '@/components/views/store/storeHolidayEdit'
import StoreHolidayAdd from '@/components/views/store/storeHolidayAdd'
import StoreOpentime from '@/components/views/store/storeOpentime'
import StoreIceReserve from '@/components/views/store/storeIceReserve'
import StoreCoachReserve from '@/components/views/store/storeCoachReserve'
// 咨询管理
import Information from '@/components/views/information/information'
import AddInformation from '@/components/views/information/addInformation'
import InformationDetial from '@/components/views/information/informationDetial'
// banner管理
import Banner from '@/components/views/banner/banner'
import BannerAdd from '@/components/views/banner/bannerAdd'
import BannerEdit from '@/components/views/banner/bannerEdit'
import BannerDetail from '@/components/views/banner/bannerDetail'
// 活动管理
import Activity from '@/components/views/activity/activity'
import ActivityAdd from '@/components/views/activity/activityAdd'
import ActivityUpdate from '@/components/views/activity/activityUpdate'
import EnrollDetial from '@/components/views/activity/enrollDetial'
import ActivityDetail from '@/components/views/activity/activityDetail'
// 用户管理
import User from '@/components/views/user/user'
// 角色管理
import Role from '@/components/views/system/role/role'
import RoleAdd from '@/components/views/system/role/roleAdd'
import RoleEdit from '@/components/views/system/role/roleEdit'
// 数据字典
import Dictionary from '@/components/views/dictionary/dictionary'
import DictionaryAdd from '@/components/views/dictionary/dictionaryAdd'
import DictionaryEdit from '@/components/views/dictionary/dictionaryEdit'
// 售票管理
import ProduceTicket from '@/components/views/ticket/produceTicket'
// 单次票
import OnceTicket from '@/components/views/ticket/onceTicket'
import OnceTicketDetail from '@/components/views/ticket/onceTicketDetail'
import OnceTicketEdit from '@/components/views/ticket/onceTicketEdit'
// 时段票
import PeriodTicket from '@/components/views/ticket/periodTicket'
import PeriodTicketList from '@/components/views/ticket/periodTicketList'
import PeriodTicketEdit from '@/components/views/ticket/periodTicketEdit'
import PeriodTicketDetail from '@/components/views/ticket/periodTicketDetail'
// 陪同票
import companyTicketList from '@/components/views/ticket/companyTicketList'
import companyTicket from '@/components/views/ticket/companyTicket'
import companyTicketEdit from '@/components/views/ticket/companyTicketEdit'
import companyTicketDetail from '@/components/views/ticket/companyTicketDetail'
// 练习票
import exerciseTicketList from '@/components/views/ticket/exerciseTicketList'
import exerciseTicket from '@/components/views/ticket/exerciseTicket'
import exerciseTicketEdit from '@/components/views/ticket/exerciseTicketEdit'
// 售票
import BookingTicket from '@/components/views/bookingTicket/bookTicket'
import BookingSingle from '@/components/views/bookingTicket/single'
import BookingPeriod from '@/components/views/bookingTicket/period'
import BookingExercise from '@/components/views/bookingTicket/exercise'
import BookingCompany from '@/components/views/bookingTicket/company'
// 续费
import Renew from '@/components/views/ticket/renew'
import RenewDetail from '@/components/views/ticket/renewDetail'
// 添加折扣
import AddDiscount from '@/components/views/bookingTicket/addDiscount'
// 票实例
import TicketInstance from '@/components/views/bookingTicket/ticketInstance'
// 消息管理
import News from '@/components/views/news/news'
import NewsAdd from '@/components/views/news/newsAdd'
import NewsEdit from '@/components/views/news/newsEdit'
import NewsSend from '@/components/views/news/newsSend'
import NewsRecord from '@/components/views/news/newsRecord'
// 组织机构
import Organization from '@/components/views/system/organization/organization'
import OrganizationAdd from '@/components/views/system/organization/OrganizationAdd'
import OrganizationEdit from '@/components/views/system/organization/OrganizationEdit'
// 门店
import Store from '@/components/views/system/store/store'
import StoreAdd from '@/components/views/system/store/storeAdd'
import StoreEdit from '@/components/views/system/store/storeEdit'
import StoreDetial from '@/components/views/system/store/storeDetial'
// 请假管理
import LeaveList from '@/components/views/leave/leave'
import LeaveEdit from '@/components/views/leave/leaveEdit'
import Reject from '@/components/views/leave/reject'
import LeaveDetail from '@/components/views/leave/leaveDetail'
// 缴费管理
import Payment from '@/components/views/payment/payment'
import PaymentAdd from '@/components/views/payment/paymentAdd'
import PaymentEdit from '@/components/views/payment/paymentEdit'
import ShopCart from '@/components/views/payment/shopcart'
import PaymentOrderList from '@/components/views/payment/paymentOrderList'
import OrderPayDetial from '@/components/views/payment/payOrderDetial'
import OldOrderDetail from '@/components/views/payment/oldOrderDetail'
import PaymentRefund from '@/components/views/payment/refund'
// 缴费添加新的页面
import PaymentDiscount from '@/components/views/payment/addDiscount'
import PaymentPay from '@/components/views/payWay/paymentPay'
// 订单管理
import TicketOrder from '@/components/views/order/ticketOrder'
import TicketOrderDetail from '@/components/views/order/OrderDetail'
import GoodsOrder from '@/components/views/order/goodsOrder'
import GoodsOrderDetail from '@/components/views/order/goodsOrderDetail'
import SellCourseOrder from '@/components/views/order/courseOrder'
import SellCourseOrderDetail from '@/components/views/order/courseOrderDetail'
import ExperienceCourseOrder from '@/components/views/order/experienceCourseOrder'
import TradeDetail from '@/components/views/order/tradeDetail'
import RenewOrder from '@/components/views/order/renewOrder'
import PaymentOrder from '@/components/views/order/paymentOrder'
import ActivityOrder from '@/components/views/order/activityOrder'
import ActivityOrderDetail from '@/components/views/order/activityOrderDetail'
// 退款
import Refund from '@/components/views/refund/refund'
import RefundDetail from '@/components/views/refund/refundDetail'
// 售票支付方式
import ChooseWay from '@/components/views/payWay/chooseWay'
// 延时续场费支付方式
import TimeoutPay from '@/components/views/payWay/timeoutPay'
// 购买延时续场费
import BuyRenew from '@/components/views/ticket/buyRenew'
// 补录交易支付
import AddTrade from '@/components/views/payWay/addTrade'
// 课
import Course from '@/components/views/course/courseList'
import CourseAdd from '@/components/views/course/courseAdd'
import CourseDetial from '@/components/views/course/courseDetial'
import CourseEdit from '@/components/views/course/courseEdit'
import CourseType from '@/components/views/course/courseType'
import CourseTypeAdd from '@/components/views/course/courseTypeAdd'
import courseEvaluateCoach from '@/components/views/course/courseEvaluate-Coach'
import courseEvaluateStudent from '@/components/views/course/courseEvaluate-Student'
import StudentsCourse from '@/components/views/course/studentsCourse'
import CourseOrder from '@/components/views/course/courseOrder'
import CourseOrderUnusual from '@/components/views/course/courseOrder-unusual'
import CourseOrderExperience from '@/components/views/course/courseOrder-experience'
import ExperienceOrderDetail from '@/components/views/course/experienceOrderDetail'
import CourseInfo from '@/components/views/course/courseInfo'
import CourseBuy from '@/components/views/course/courseBuyList'
import CourseOrderSure from '@/components/views/course/courseOrderSure'
import CourseOrderPay from '@/components/views/course/courseOrderPay'
import CourseOrderDetial from '@/components/views/course/courseOrderDetial'
import CheckCourseType from '@/components/views/course/checkCourseType'
import CheckCoach from '@/components/views/course/checkCoach'
import CheckTime from '@/components/views/course/checkTime'
import CheckTimeOverDetial from '@/components/views/course/checkTimeOverDetial'
import StudentCheckType from '@/components/views/course/studentCheckType'
import StudentCheckCoach from '@/components/views/course/studentCheckCoach'
import StudentCheckTime from '@/components/views/course/studentCheckTime'
import StudentCheckSure from '@/components/views/course/studentCheckSure'
import StudentCheckPay from '@/components/views/course/studentCheckPay'
// 旧的调课页面
import ChangeOneCourse from '@/components/views/course/changeOneCourse'
// 新增调课页面
import UpdateOneCourse from '@/components/views/course/updateOneCourse'
import ChangeAllCourse from '@/components/views/course/changeAllCourse'
import CourseOrderTable from '@/components/views/course/courseOrderTable'
import ChangeLiveCourse from '@/components/views/course/changeLiveCourse'
import TasteCourseSet from '@/components/views/course/tasteCourseSet'
import TasteCourseBuy from '@/components/views/course/tasteCourseBuy'
import TasteCourseCoach from '@/components/views/course/tasteCourseCoach'
import TasteCoursePay from '@/components/views/course/tasteCoursePay'
import AddStudentSure from '@/components/views/course/addStudentSure'
import AddStudentPay from '@/components/views/course/addStudentPay'
import AddStudentDetial from '@/components/views/course/addStudentDetial'
import DropCourse from '@/components/views/course/dropCourse'
import CourseRefund from '@/components/views/course/courseRefund'
import CourseRefundDetail from '@/components/views/course/courseRefundDetail'
// 课程报表导出
import CourseExport from '@/components/views/course/courseExport'
// 加入学员跳转到订单详情页面
import AddStudentDetailF from '@/components/views/course/addStudentDetailF'
// 加入学员补差价支付
import AddStudentClosingPrice from '@/components/views/course/addStudentClosingPrice'
// 财务管理
// 卡券统计
import CouponCount from '@/components/views/finance/couponCount'
// 售票统计
import TicketCount from '@/components/views/finance/ticketCount'
// 售票收入统计
import TicketAmount from '@/components/views/finance/ticketAmount'
// 支付方式统计
import PayWayCount from '@/components/views/finance/payWay'
// 售票退款汇总
import RefundPayWay from '@/components/views/finance/refundAmount'
// 意见反馈
import Opinion from '@/components/views/opinion/opinion'
// 版本管理
import Version from '@/components/views/version/version'
import VersionAdd from '@/components/views/version/versionAdd'
// 现场管理
import Borrow from '@/components/views/scence/borrow'
import Return from '@/components/views/scence/return'
import EnterRecord from '@/components/views/scence/enterRecord'
// 商品管理
import GoodsType from '@/components/views/goods/goodsType'
import AddGoodsType from '@/components/views/goods/addGoodsType'
import EditGoodsType from '@/components/views/goods/editGoodsType'
import GoodsTypeDetail from '@/components/views/goods/goodsTypeDetail'
import Goods from '@/components/views/goods/goods'
import GoodsAdd from '@/components/views/goods/goodsAdd'
import GoodsEdit from '@/components/views/goods/goodsEdit'
import GoodsDetail from '@/components/views/goods/goodsDetail'
import GoodsShopCart from '@/components/views/goods/goodsShopCart'
// 商品支付方式选择
import GoodsPayWay from '@/components/views/payWay/goodsPay'
// 库存管理
import PutIn from '@/components/views/stock/putin'
import PutInAdd from '@/components/views/stock/putinAdd'
import PutInAddDetail from '@/components/views/stock/putinAddDetail'
import PutOut from '@/components/views/stock/putout'
import PutOutAdd from '@/components/views/stock/putoutAdd'
import PutOutAddDetail from '@/components/views/stock/putoutAddDetail'
import Stock from '@/components/views/stock/stock'
import Inventory from '@/components/views/stock/inventory'
import InventoryDetail from '@/components/views/stock/inventoryDetail'
import TaskAdd from '@/components/views/stock/taskAdd'
import TaskEdit from '@/components/views/stock/taskEdit'
// 查看总库存
import CheckAddStock from '@/components/views/stock/checkAddStock'
// 目标商品
import TargetGoods from '@/components/views/stock/targetGoods'
import TargetGoodsDetail from '@/components/views/stock/targetGoodsDetail'
// 盘点
import InventoryAdd from '@/components/views/stock/inventoryAdd'
import GoodsDetailStock from '@/components/views/stock/goodsDetail'
// 交接单
import Delivery from '@/components/views/goods/delivery'
import DeliveryList from '@/components/views/goods/deliveryList'
import DeliveryDetail from '@/components/views/goods/deliveryDetail'
// 扫描器管理
import Scanner from '@/components/views/scanner/scanner'
import ScannerAdd from '@/components/views/scanner/scannerAdd'
import ScannerEdit from '@/components/views/scanner/scannerEdit'
import ScannerDetail from '@/components/views/scanner/scannerDEtail'
// 过闸次数限定
import CountLimit from '@/components/views/scanner/count/countLimit'
import CountLimitAdd from '@/components/views/scanner/count/countLimitAdd'
import CountLimitEdit from '@/components/views/scanner/count/countLimitEdit'
// 报表管理
import DaySell from '@/components/views/report/daySell'
import DaySellDetail from '@/components/views/report/daySellDetail'
import OtherPaymentDetail from '@/components/views/report/otherPaymentDetail'
import PeriodState from '@/components/views/report/periodState'
import PeriodEnterRecord from '@/components/views/report/enterRecord'
import MemberReport from '@/components/views/report/member'
import MemberCourseReport from '@/components/views/report/memberCourse'
import RefundRecord from '@/components/views/report/refundRecord'
import ChargeReport from '@/components/views/report/chargeReport'
import SallCountReport from '@/components/views/report/sallCountReport'
// 供应商管理
import Supply from '@/components/views/supply/supply'
import SupplyAdd from '@/components/views/supply/supplyAdd'
import SupplyEdit from '@/components/views/supply/supplyEdit'
import SupplyDetail from '@/components/views/supply/supplyDetail'
// 购课须知
import CourseTip from '@/components/views/course/buyCourseTip'
// 体验课订单确认
import ExperienceOrderConfirm from '@/components/views/course/experienceOrderConfirm'
// 当日首次上课学员列表
import AttendCourseFirt from '@/components/views/course/attendCourseFirst'
// 学员课节变更记录
import BaseCourseChangeList from '@/components/views/course/baseCourseChangeList'
// 学员课节变更记录查看
import BaseCourseChangeListDetail from '@/components/views/course/baseCourseChangeListDetail'
// 会员手机号变更记录
import MemberMobileChange from '@/components/views/member/memberMobileChange'
// 添加短信验证码查询界面
import SMS from '@/components/views/system/sms'
// 脱机预警
import Offline from '@/components/views/system/offline'
// 添加百度编辑器
import UEditor from '@/components/views/common/ueditor/ueditor'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: Login
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/coupon',
      name: 'CouponList',
      component: CouponList
    },
    {
      path: '/addCoupon',
      name: 'AddCoupon',
      component: AddCoupon
    },
    {
      path: '/couponEdit/:couponId',
      name: 'EditCoupon',
      component: EditCoupon
    },
    {
      path: '/couponDetail/:couponId',
      name: 'CouponDetail',
      component: CouponDetail
    },
    {
      path: '/receive/:rid',
      name: 'Receive',
      component: ReceiveList
    },
    {
      path: '/couponExchange',
      name: 'CouponExchange',
      component: CouponExchange
    },
    {
      path: '/lotsCoupon',
      name: 'LotsCoupon',
      component: LotsCoupon
    },
    {
      path: '/lotsCouponCreate',
      name: 'LotsCouponCreate',
      component: LotsCouponCreate
    },
    {
      path: '/lotsCouponDetail/:lid/:batch',
      name: 'LotsCouponDetail',
      component: LotsCouponDetail
    },
    {
      path: '/couponDateSet/:batch/:name',
      name: 'CouponDateSet',
      component: CouponDateSet
    },
    {
      path: '/memberBenefit',
      name: 'Benefit',
      component: Benefit
    },
    {
      path: '/editBenefit/:level',
      name: 'EditBenefit',
      component: EditBenefit
    },
    {
      path: '/pointConfig',
      name: 'pointConfig',
      component: PointConfig
    },
    {
      path: '/memberInfo',
      name: 'MemberInfo',
      component: MemberInformation
    },
    {
      path: '/memberInfoDetail/:mid',
      name: 'MemberInfoDetail',
      component: MemberInformationDetail
    },
    {
      path: '/memberInfoEdit/:mid',
      name: 'MemberInformationEdit',
      component: MemberInformationEdit
    },
    {
      path: '/memberPointEdit/:mid',
      name: 'MemberPointEdit',
      component: MemberPointEdit
    },
    {
      path: '/editor',
      name: 'VueEditor',
      component: VueEditor
    },
    {
      path: '/employee',
      name: 'EmployeeList',
      component: EmployeeList
    },
    {
      path: '/employeeAdd',
      name: 'EmployeeAdd',
      component: EmployeeAdd
    },
    {
      path: '/employee/:eid',
      name: 'EmployeeDetail',
      component: EmployeeDetail
    },
    {
      path: '/employeeEdit/:eid',
      name: 'EmployeeEdit',
      component: EmployeeEdit
    },
    {
      path: '/charges',
      name: 'ChargeList',
      component: ChargeList
    },
    {
      path: '/chargeAdd',
      name: 'ChangeAdd',
      component: ChargeAdd
    },
    {
      path: '/chargeUpdate/:cid',
      name: 'ChangeUpdate',
      component: ChargeUpdate
    },
    {
      path: '/storeMsg',
      name: 'StoreMsg',
      component: StoreMsg
    },
    {
      path: '/storeHoliday',
      name: 'StoreHoliday',
      component: StoreHoliday
    },
    {
      path: '/storeHolidayEdit/:shid',
      name: 'StoreHolidayEdit',
      component: StoreHolidayEdit
    },
    {
      path: '/storeHolidayAdd',
      name: 'StoreHolidayAdd',
      component: StoreHolidayAdd
    },
    {
      path: '/storeOpentime',
      name: 'StoreOpentime',
      component: StoreOpentime
    },
    {
      path: '/storeIceReserve',
      name: 'StoreIceReserve',
      component: StoreIceReserve
    },
    {
      path: '/storeCoachReserve',
      name: 'StoreCoachReserve',
      component: StoreCoachReserve
    },
    {
      path: '/information',
      name: 'Information',
      component: Information
    },
    {
      path: '/addInformation',
      name: 'AddInformation',
      component: AddInformation
    },
    {
      path: '/informationDetial/:id',
      name: 'InformationDetial',
      component: InformationDetial
    },
    {
      path: '/banner',
      name: 'Banner',
      component: Banner
    },
    {
      path: '/bannerAdd',
      name: 'BannerAdd',
      component: BannerAdd
    },
    {
      path: '/bannerEdit/:bid',
      name: 'BannerEdit',
      component: BannerEdit
    },
    {
      path: '/banner/:bid',
      name: 'BannerDetail',
      component: BannerDetail
    },
    {
      path: '/activity',
      name: 'Activity',
      component: Activity
    },
    {
      path: '/activityAdd',
      name: 'ActivityAdd',
      component: ActivityAdd
    },
    {
      path: '/activityUpdate/:eid',
      name: 'ActivityUpdate',
      component: ActivityUpdate
    },
    {
      path: '/enrollDetial/:eid',
      name: 'EnrollDetial',
      component: EnrollDetial
    },
    {
      path: '/activity/:aid',
      name: 'ActivityDetail',
      component: ActivityDetail
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
    {
      path: '/role',
      name: 'Role',
      component: Role
    },
    {
      path: '/roleAdd',
      name: 'RoleAdd',
      component: RoleAdd
    },
    {
      path: '/roleEdit/:rid',
      name: 'RoleEdit',
      component: RoleEdit
    },
    {
      path: '/dictionary',
      name: 'Dictionary',
      component: Dictionary
    },
    {
      path: '/dictionaryAdd',
      name: 'DictionaryAdd',
      component: DictionaryAdd
    },
    {
      path: '/dictionaryEdit/:did',
      name: 'DictionaryEdit',
      component: DictionaryEdit
    },
    {
      path: '/produceTicket',
      name: 'ProduceTicket',
      component: ProduceTicket
    },
    {
      path: '/onceTicket',
      name: 'OnceTicket',
      component: OnceTicket
    },
    {
      path: '/onceTicketDetail/:oid',
      name: 'OnceTicketDetail',
      component: OnceTicketDetail
    },
    {
      path: '/onceTicketEdit/:oid',
      name: 'OnceTicketEdit',
      component: OnceTicketEdit
    },
    {
      path: '/periodTicket',
      name: 'PeriodTicket',
      component: PeriodTicket
    },
    {
      path: '/periodTicketList',
      name: 'PeriodTicketList',
      component: PeriodTicketList
    },
    {
      path: '/periodTicketEdit/:pid',
      name: 'PeriodTicketEdit',
      component: PeriodTicketEdit
    },
    {
      path: '/periodTicketDetail/:pid',
      name: 'PeriodTicketDetail',
      component: PeriodTicketDetail
    },
    {
      path: '/companyTicketList',
      name: 'companyTicketList',
      component: companyTicketList
    },
    {
      path: '/companyTicket',
      name: 'companyTicket',
      component: companyTicket
    },
    {
      path: '/companyTicketEdit/:cid',
      name: 'companyTicketEdit',
      component: companyTicketEdit
    },
    {
      path: '/companyTicketDetail/:cid',
      name: 'companyTicketDetail',
      component: companyTicketDetail
    },
    {
      path: '/exerciseTicketList',
      name: 'exerciseTicketList',
      component: exerciseTicketList
    },
    {
      path: '/exerciseTicket',
      name: 'exerciseTicket',
      component: exerciseTicket
    },
    {
      path: '/exerciseTicketEdit/:eid',
      name: 'exerciseTicketEdit',
      component: exerciseTicketEdit
    },
    {
      path: '/renew',
      name: 'Renew',
      component: Renew
    },
    {
      path: '/renewDetail/:rid',
      name: 'RenewDetail',
      component: RenewDetail
    },
    {
      path: '/bookTicket',
      name: '/BookTicket',
      component: BookingTicket
    },
    {
      path: '/bookSingle',
      name: 'BookingSingle',
      component: BookingSingle
    },
    {
      path: '/bookingPeriod/:memberId',
      name: 'BookingPeriod',
      component: BookingPeriod
    },
    {
      path: '/bookingExercise/:mid',
      name: 'BookingExercise',
      component: BookingExercise
    },
    {
      path: '/bookingCompany/:bid',
      name: 'BookingCompany',
      component: BookingCompany
    },
    {
      path: '/addDiscount/:oid',
      name: 'AddDiscount',
      component: AddDiscount
    },
    {
      path: '/ticketInstance/:oid/:from',
      name: 'TicketInstance',
      component: TicketInstance
    },
    {
      path: '/putOutTicket',
      name: 'PutOutTicket',
      component: PutOutTicket
    },
    {
      path: '/putOutTicketAdd',
      name: 'PutOutTicketAdd',
      component: PutOutTicketAdd
    },
    {
      path: '/menu',
      name: 'Menu',
      component: Menu
    },
    {
      path: '/tree',
      name: 'MyTree',
      component: MyTree
    },
    {
      path: '/news',
      name: 'News',
      component: News
    },
    {
      path: '/newsAdd',
      name: 'NewsAdd',
      component: NewsAdd
    },
    {
      path: '/newsEdit/:nid',
      name: 'NewsEdit',
      component: NewsEdit
    },
    {
      path: '/newsSend/:nid',
      name: 'NewsSend',
      component: NewsSend
    },
    {
      path: '/newsRecord',
      name: 'NewsRecord',
      component: NewsRecord
    },
    {
      path: '/organization',
      name: 'Organization',
      component: Organization
    },
    {
      path: '/organizationAdd',
      name: 'OrganizationAdd',
      component: OrganizationAdd
    },
    {
      path: '/organization/edit/:oid',
      name: 'OrganizationEdit',
      component: OrganizationEdit
    },
    {
      path: '/store',
      name: 'Store',
      component: Store
    },
    {
      path: '/storeAdd',
      name: 'StoreAdd',
      component: StoreAdd
    },
    {
      path: '/store/edit/:sid',
      name: 'StoreEdit',
      component: StoreEdit
    },
    {
      path: '/store/detial/:did',
      name: 'StoreDetial',
      component: StoreDetial
    },
    {
      path: '/leaveList',
      name: 'Leave',
      component: LeaveList
    },
    {
      path: '/leave/edit/:lid',
      name: 'LeaveEdit',
      component: LeaveEdit
    },
    {
      path: '/leave/detail/:lid',
      name: 'LeaveDetail',
      component: LeaveDetail
    },
    {
      path: '/reject/rid',
      name: 'Reject',
      component: Reject
    },
    {
      path: '/payment',
      name: 'Payment',
      component: Payment
    },
    {
      path: '/paymentAdd',
      name: 'PaymentAdd',
      component: PaymentAdd
    },
    {
      path: '/paymentEdit/:pid',
      name: 'PaymentEdit',
      component: PaymentEdit
    },
    {
      path: '/shopCart',
      name: 'ShopCart',
      component: ShopCart
    },
    {
      path: '/payOrderDetial/:oid',
      name: 'OrderPayDetial',
      component: OrderPayDetial
    },
    {
      path: '/oldOrderDetail/:poid',
      name: 'OldOrderDetail',
      component: OldOrderDetail
    },
    {
      path: '/paymentRefund',
      name: 'PaymentRefund',
      component: PaymentRefund
    },
    {
      path: '/paymentDiscount/:oid',
      name: 'paymentDiscount',
      component: PaymentDiscount
    },
    {
      path: '/paymentPay/:oid',
      name: 'PaymentPay',
      component: PaymentPay
    },
    {
      path: '/paymentOrderList',
      name: 'PaymentOrderList',
      component: PaymentOrderList
    },
    {
      path: '/activityOrder',
      name: 'ActivityOrder',
      component: ActivityOrder
    },
    {
      path: '/activityOrderDetail/:oid',
      name: 'ActivityOrderDetail',
      component: ActivityOrderDetail
    },
    {
      path: '/ticketOrder',
      name: 'TicketOrder',
      component: TicketOrder
    },
    {
      path: '/ticketOrderDetail/:tid/:from',
      name: 'TicketOrderDetail',
      component: TicketOrderDetail
    },
    {
      path: '/paymentOrder',
      name: 'PaymentOrder',
      component: PaymentOrder
    },
    {
      path: '/sellCourseOrderDetail/:tid/:from',
      name: 'SellCourseOrderDetail',
      component: SellCourseOrderDetail
    },
    {
      path: '/tradeDetail/:oid/:tid',
      name: 'TradeDetail',
      component: TradeDetail
    },
    {
      path: '/sellCourseOrder',
      name: 'CourseOrder',
      component: SellCourseOrder
    },
    {
      path: '/experienceCourseOrder',
      name: 'ExperienceCourseOrder',
      component: ExperienceCourseOrder
    },
    {
      path: '/renewOrder',
      name: 'RenewOrder',
      component: RenewOrder
    },
    {
      path: '/goodsOrder',
      name: 'GoodsOrder',
      component: GoodsOrder
    },
    {
      path: '/goodsOrderDetail/:tid',
      name: 'GoodsOrderDetail',
      component: GoodsOrderDetail
    },
    {
      path: '/refund',
      name: 'Refund',
      component: Refund
    },
    {
      path: '/refundDetail/:rid/:from',
      name: 'RefundDetail',
      component: RefundDetail
    },
    {
      path: '/chooseWay/:oid',
      name: 'ChooseWay',
      component: ChooseWay
    },
    {
      path: '/timeoutPay/:oid/:code',
      name: 'timeoutPay',
      component: TimeoutPay
    },
    {
      path: '/buyRenew/:oid',
      name: 'BuyRenew',
      component: BuyRenew
    },
    {
      path: '/addTrade/:oid/:tid',
      name: 'AddTrade',
      component: AddTrade
    },
    {
      path: '/courseDetial/:id',
      name: 'CourseDetial',
      component: CourseDetial
    },
    {
      path: '/courseList',
      name: 'Course',
      component: Course
    },
    {
      path: '/courseAdd',
      name: 'CourseAdd',
      component: CourseAdd
    },
    {
      path: '/courseEdit/:id',
      name: 'CourseEdit',
      component: CourseEdit
    },
    {
      path: '/courseType',
      name: 'CourseType',
      component: CourseType
    },
    {
      path: '/courseTypeAdd',
      name: 'CourseTypeAdd',
      component: CourseTypeAdd
    },
    {
      path: '/courseEvaluate-Coach',
      name: 'courseEvaluateCoach',
      component: courseEvaluateCoach
    },
    {
      path: '/courseEvaluate-Student',
      name: 'courseEvaluateStudent',
      component: courseEvaluateStudent
    },
    {
      path: '/courseOrder',
      name: 'CourseOrder',
      component: CourseOrder
    },
    {
      path: '/studentsCourse',
      name: 'StudentsCourse',
      component: StudentsCourse
    },
    {
      path: '/courseOrder-unusual',
      name: 'CourseOrderUnusual',
      component: CourseOrderUnusual
    },
    {
      path: '/courseOrder-experience',
      name: 'CourseOrderExperience',
      component: CourseOrderExperience
    },
    {
      path: '/experienceOrderDetail/:oid',
      name: 'ExperienceOrderDetail',
      component: ExperienceOrderDetail
    },
    {
      path: '/courseInfo/:id',
      name: 'CourseInfo',
      component: CourseInfo
    },
    {
      path: '/courseBuyList',
      name: 'CourseBuy',
      component: CourseBuy
    },
    {
      path: '/courseOrderSure/:courseId/:courseLevel/:memberId',
      name: 'CourseOrderSure',
      component: CourseOrderSure
    },
    {
      path: '/courseOrderPay/:courseId/:courseLevel/:orderId/:paid/:price/:memberId',
      name: 'CourseOrderPay',
      component: CourseOrderPay
    },
    {
      path: '/courseOrderDetial/:courseId/:courseLevel/:orderId',
      name: 'CourseOrderDetial',
      component: CourseOrderDetial
    },
    {
      path: '/checkCourseType/:courseLevel/:courseMemberId',
      name: 'CheckCourseType',
      component: CheckCourseType
    },
    {
      path: '/checkCoach/:courseMemberId/:courseType/:courseLevel',
      name: 'CheckCoach',
      component: CheckCoach
    },
    {
      path: '/checkTime/:coachId/:courseMemberId/:courseTypeCode/:courseLevel',
      name: 'CheckTime',
      component: CheckTime
    },
    {
      path: '/checkTimeOverDetial/:courseCoachId',
      name: 'CheckTimeOverDetial',
      component: CheckTimeOverDetial
    },
    {
      path: '/studentCheckType/:courseMemberId',
      name: 'StudentCheckType',
      component: StudentCheckType
    },
    {
      path: '/studentCheckCoach/:courseLevel/:courseMemberId/:courseTypeCode/:courseLabel',
      name: 'StudentCheckCoach',
      component: StudentCheckCoach
    },
    {
      path: '/studentCheckTime/:coachId/:courseId/:courseLevel/:courseMemberId/:courseTypeCode',
      name: 'StudentCheckTime',
      component: StudentCheckTime
    },
    {
      path: '/studentCheckPay/:orderNo/:chajia',
      name: 'StudentCheckPay',
      component: StudentCheckPay
    },
    {
      path: '/studentCheckSure/:orderNo',
      name: 'StudentCheckSure',
      component: StudentCheckSure
    },
    {
      path: '/changeOneCourse/:courseCoachId',
      name: 'ChangeOneCourse',
      component: ChangeOneCourse
    },
    {
      path: '/updateOneCourse/:courseCoachId',
      name: 'UpdateOneCourse',
      component: UpdateOneCourse
    },
    {
      path: '/changeAllCourse/:courseCoachId',
      name: 'ChangeAllCourse',
      component: ChangeAllCourse
    },
    {
      path: '/courseOrderTable/:courseCoachId',
      name: 'CourseOrderTable',
      component: CourseOrderTable
    },
    {
      path: '/changeLiveCourse',
      name: 'ChangeLiveCourse',
      component: ChangeLiveCourse
    },
    {
      path: '/tasteCourseSet',
      name: 'TasteCourseSet',
      component: TasteCourseSet
    },
    {
      path: '/tasteCourseBuy',
      name: 'TasteCourseBuy',
      component: TasteCourseBuy
    },
    {
      path: '/tasteCourseCoach/:classTime/:theDay',
      name: 'TasteCourseCoach',
      component: TasteCourseCoach
    },
    {
      path: '/tasteCoursePay/:coachId/:courseId/:day/:memberId/:orderId/:price/:timeOfDay',
      name: 'TasteCoursePay',
      component: TasteCoursePay
    },
    {
      path: '/addStudentSure/:courseCoachId/:courseId/:courseLevel/:memberId',
      name: 'AddStudentSure',
      component: AddStudentSure
    },
    {
      path: '/addStudentPay/:courseCoachId/:courseId/:courseLevel/:orderId/:paid/:price/:memberId',
      name: 'AddStudentPay',
      component: AddStudentPay
    },
    {
      path: '/addStudentDetial/:courseCoachId',
      name: 'AddStudentDetial',
      component: AddStudentDetial
    },
    {
      path: '/dropCourse/:courseId',
      name: 'DropCourse',
      component: DropCourse
    },
    {
      path: '/courseRefund',
      name: 'CourseRefund',
      component: CourseRefund
    },
    {
      path: '/courseRefundDetail/:courseId/:memberId',
      name: 'CourseRefundDetail',
      component: CourseRefundDetail
    },
    {
      path: '/addStudentDetailF/:orderNo',
      name: 'AddStudentDetailF',
      component: AddStudentDetailF
    },
    {
      path: '/addStudentClosingPrice/:orderNo',
      name: 'AddStudentClosingPrice',
      component: AddStudentClosingPrice
    },
    {
      path: '/finance/couponCount',
      name: 'CouponCount',
      component: CouponCount
    },
    {
      path: '/finance/ticketCount',
      name: 'TicketCount',
      component: TicketCount
    },
    {
      path: '/finance/ticketAmount',
      name: 'TicketAmount',
      component: TicketAmount
    },
    {
      path: '/finance/payWay',
      name: 'TicketPayWay',
      component: PayWayCount
    },
    {
      path: '/refund/payWay',
      name: 'RefundPayWay',
      component: RefundPayWay
    },
    {
      path: '/opinion',
      name: 'Opinion',
      component: Opinion
    },
    {
      path: '/version',
      name: 'Version',
      component: Version
    },
    {
      path: '/versionAdd',
      name: 'VersionAdd',
      component: VersionAdd
    },
    {
      path: '/borrow',
      name: 'Borrow',
      component: Borrow
    },
    {
      path: '/return',
      name: 'Return',
      component: Return
    },
    {
      path: '/enterRecord',
      name: 'EnterRecord',
      component: EnterRecord
    },
    {
      path: '/goodsType',
      name: 'GoodsType',
      component: GoodsType
    },
    {
      path: '/addGoodsType',
      name: 'AddGoodsType',
      component: AddGoodsType
    },
    {
      path: '/editGoodsType/:gid',
      name: 'EditGoodsType',
      component: EditGoodsType
    },
    {
      path: '/goodsTypeDetail/:gid',
      name: 'GoodsTypeDetail',
      component: GoodsTypeDetail
    },
    {
      path: '/goods',
      name: 'Goods',
      component: Goods
    },
    {
      path: '/goodsAdd',
      name: 'GoodsAdd',
      component: GoodsAdd
    },
    {
      path: '/goodsEdit/:gid',
      name: 'GoodsEdit',
      component: GoodsEdit
    },
    {
      path: '/goods/:gid',
      name: 'GoodsDetail',
      component: GoodsDetail
    },
    {
      path: '/goodsShopCart',
      name: 'GoodsShopCart',
      component: GoodsShopCart
    },
    {
      path: '/putin',
      name: 'PutIn',
      component: PutIn
    },
    {
      path: '/putinAdd',
      name: 'PutInAdd',
      component: PutInAdd
    },
    {
      path: '/putinAdd/:pid',
      name: 'PutInAddDetail',
      component: PutInAddDetail
    },
    {
      path: '/putoutAdd/:pid',
      name: 'PutOutAddDetail',
      component: PutOutAddDetail
    },
    {
      path: '/putout',
      name: 'PutOut',
      component: PutOut
    },
    {
      path: '/putoutAdd',
      name: 'PutOutAdd',
      component: PutOutAdd
    },
    {
      path: '/goodsPayWay/:oid',
      name: 'GoodsPayWay',
      component: GoodsPayWay
    },
    {
      path: '/stock',
      name: 'Stock',
      component: Stock
    },
    {
      path: '/inventory',
      name: 'Inventory',
      component: Inventory
    },
    {
      path: '/inventory/:iid',
      name: 'InventoryDetail',
      component: InventoryDetail
    },
    {
      path: '/delivery',
      name: 'Delivery',
      component: Delivery
    },
    {
      path: '/deliveryList',
      name: 'DeliveryList',
      component: DeliveryList
    },
    {
      path: '/delivery/:did',
      name: 'DeliveryDetail',
      component: DeliveryDetail
    },
    {
      path: '/scanner',
      name: 'Scanner',
      component: Scanner
    },
    {
      path: '/scannerAdd',
      name: 'ScannerAdd',
      component: ScannerAdd
    },
    {
      path: '/scannerEdit/:sid',
      name: 'ScannerEdit',
      component: ScannerEdit
    },
    {
      path: '/scanner/:sid',
      name: 'ScannerDetail',
      component: ScannerDetail
    },
    {
      path: '/updatePass',
      name: 'UpdatePass',
      component: UpdatePass
    },
    {
      path: '/countLimit',
      name: 'CountLimit',
      component: CountLimit
    },
    {
      path: '/countLimitAdd',
      name: 'CountLimitAdd',
      component: CountLimitAdd
    },
    {
      path: '/countLimitEdit/:cid',
      name: 'CountLimitEdit',
      component: CountLimitEdit
    },
    {
      path: '/courseExport',
      name: 'CourseExport',
      component: CourseExport
    },
    {
      path: '/daySell',
      name: 'DaySell',
      component: DaySell
    },
    {
      path: '/daySellDetail',
      name: 'DaySellDetail',
      component: DaySellDetail
    },
    {
      path: '/otherPaymentDetail',
      name: 'OtherPaymentDetail',
      component: OtherPaymentDetail
    },
    {
      path: '/periodState',
      name: 'PeriodState',
      component: PeriodState
    },
    {
      path: '/memberReport',
      name: 'MemberReport',
      component: MemberReport
    },
    {
      path: '/memberCourseReport',
      name: 'MemberCourseReport',
      component: MemberCourseReport
    },
    {
      path: '/periodEnterRecord/:pid',
      name: 'PeriodEnterRecord',
      component: PeriodEnterRecord
    },
    {
      path: '/refundRecord',
      name: 'RefundRecord',
      component: RefundRecord
    },
    {
      path: '/chargeReport',
      name: 'ChargeReport',
      component: ChargeReport
    },
    {
      path: '/sallCountReport',
      name: 'SallCountReport',
      component: SallCountReport
    },
    {
      path: '/supply',
      name: 'Supply',
      component: Supply
    },
    {
      path: '/supplyAdd',
      name: 'SupplyAdd',
      component: SupplyAdd
    },
    {
      path: '/supplyEdit/:sid',
      name: 'SupplyEdit',
      component: SupplyEdit
    },
    {
      path: '/supplyDetail/:sid',
      name: 'SupplyDetail',
      component: SupplyDetail
    },
    {
      path: '/courseTip',
      name: 'CourseTip',
      component: CourseTip
    },
    {
      path: '/experienceOrderConfirm',
      name: 'ExperienceOrderConfirm',
      component: ExperienceOrderConfirm
    },
    {
      path: '/attendCourseFirst',
      name: 'AttendCourseFirst',
      component: AttendCourseFirt
    },
    {
      path: '/baseCourseChangeList',
      name: 'BaseCourseChangeList',
      component: BaseCourseChangeList
    },
    {
      path: '/baseCourseChangeListDetail/:cid/:changeReason',
      name: 'BaseCourseChangeListDetail',
      component: BaseCourseChangeListDetail
    },
    {
      path: '/memberMobileChange',
      name: 'MemberMobileChange',
      component: MemberMobileChange
    },
    {
      path: '/sms',
      name: 'SMS',
      component: SMS
    },
    {
      path: '/offline',
      name: 'Offline',
      component: Offline
    },
    {
      path: '/ueditor',
      name: 'UEditor',
      component: UEditor
    },
    {
      path: '/taskAdd',
      name: 'TaskAdd',
      component: TaskAdd
    },
    {
      path: '/taskEdit/:taskId',
      name: 'TaskEdit',
      component: TaskEdit
    },
    {
      path: '/checkAddStock/:taskId',
      name: 'CheckAddStock',
      component: CheckAddStock
    },
    {
      path: '/targetGoods/:taskId',
      name: 'TargetGoods',
      component: TargetGoods
    },
    {
      path: '/targetGoodsDetail/:taskId',
      name: 'TargetGoodsDetail',
      component: TargetGoodsDetail
    },
    {
      path: '/inventoryAdd',
      name: 'InventoryAdd',
      component: InventoryAdd
    },
    {
      path: '/goodsDetailStock/:gid',
      name: 'GoodsDetailStock',
      component: GoodsDetailStock
    }
  ]
})
