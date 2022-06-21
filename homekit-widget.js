// https://github.com/SunBK201/ESP8266-HomeKit-Widget

const homeName = 'Temperature';
const accentColor = { hex: '#5eb8be', alpha: 1.0 };

let widget = await createWidget()

if (!config.runsInWidget) {
  await widget.presentSmall();
}
Script.setWidget(widget)
Script.complete();

async function loadSensorData() {
  let url = "http://your-sensor-ip/index?tab=0&sensor_refresh1=1"
  let req = new Request(url)
  let json = await req.loadJSON()
  return json
}

async function createWidget() {
  let sensordata = await loadSensorData();

  // Create the widget
  const widget = new ListWidget();

  let nextRefresh = Date.now() + 1000 * 10
  widget.refreshAfterDate = new Date(nextRefresh)

  // Show home name at header
  const headerStack = widget.addStack();
  const header = headerStack.addText(homeName);
  header.textColor = new Color(accentColor.hex, accentColor.alpha);
  header.font = Font.systemFont(18);

  let time = new Date();
  let hours = time.getHours().toString();
  let minutes = time.getMinutes().toString();
  let seconds = time.getSeconds().toString();
  let time_text = widget.addText(hours + "h" + ":" + minutes + "m" + ":" + seconds + "s");
  time_text.font = Font.systemFont(15);

  // Bottom align other stacks
  widget.addSpacer();

  const bodyStack = widget.addStack();
  const main = bodyStack.addText(sensordata.sensor_t.slice(0, 4) + "°C");
  main.font = Font.mediumSystemFont(33);

  const footerStack = widget.addStack();
  const leftFooterStack = footerStack.addStack();
  const left = leftFooterStack.addText(sensordata.sensor_h.slice(0, 4) + "%");
  left.font = Font.systemFont(13);
  const spliter = footerStack.addStack();
  const rightFooterStack = footerStack.addStack();
  const split = spliter.addText(' | ');
  split.font = Font.systemFont(13);
  const right = rightFooterStack.addText(sensordata.sensor_l.slice(0, 2) + " Lux");
  right.font = Font.systemFont(13);

  return widget
}