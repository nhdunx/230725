const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
var obj = JSON.parse($response.body);
obj.Attention = "UP TO NỖI HÀ DỤNG";

var dunx = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "2222-12-21T01:23:45Z",
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: "2025-07-23T14:00:00Z",
  purchase_date: "2025-07-23T14:00:00Z",
  store: "app_store"
};

var titkok = {
  grace_period_expires_date: null,
  purchase_date: "2025-07-23T14:00:00Z",
  product_identifier: "com.dunx.premium.yearly",
  expires_date: "2222-12-21T01:23:45Z"
};

// Kiểm tra User-Agent
const match = Object.keys(mapping).find(e => ua.includes(e));

if (match) {
  let [e, s] = mapping[match];
  if (s) {
    titkok.product_identifier = s;
    obj.subscriber.subscriptions[s] = dunx;
  } else {
    obj.subscriber.subscriptions["com.dunx.premium.yearly"] = dunx;
  }

  // Cấp quyền Gold cho Locket nếu User-Agent chứa 'Locket'
  if (e === 'Gold' && !obj.subscriber.entitlements['Gold']) {
    obj.subscriber.entitlements['Gold'] = titkok;
  }

  // Bật tính năng "Huy Hiệu Locket Gold" bằng cách thêm cờ hoặc tham số
  if (e === 'Gold') {
    obj.subscriber.entitlements['Gold'].feature_enabled = true;  // Thêm flag hoặc cờ bật tính năng
    obj.subscriber.entitlements['Gold'].badge = "Locket Gold";  // Cập nhật thông tin thêm cho huy hiệu
  }

  obj.subscriber.entitlements[e] = titkok;
} else {
  obj.subscriber.subscriptions["com.dunx.premium.yearly"] = dunx;
  obj.subscriber.entitlements.pro = titkok;
}

$done({ body: JSON.stringify(obj) });
