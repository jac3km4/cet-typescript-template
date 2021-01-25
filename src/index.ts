
const hotkey = 0x45;

let width: number;
let height: number;
let drawPopup = false;
let objectName: string | undefined;

registerForEvent("onInit", () => {
  let [w, h] = GetDisplayResolution();
  width = w;
  height = h;
  print("Hello");
});

registerForEvent("onUpdate", () => {
  if (!ImGui.IsKeyDown(0x10) && ImGui.IsKeyPressed(hotkey, false)) {
    const player = Game.GetPlayer();
    const obj = Game.GetTargetingSystem().GetLookAtObject(player, false, false);
    const type = obj.ToString();
    drawPopup = true;

    if (type == "Door") {
      (obj as Door).OpenDoor();
      objectName = type;

    } else if (type == "FakeDoor") {
      objectName = type;

    } else if (obj.IsVehicle() && !obj.IsDestroyed()) {
      const vehiclePS = obj.GetVehiclePS();
      const vehicleComp = obj.GetVehicleComponent();
      if (obj.GetVehiclePS().GetNpcOccupiedSlots().length > 0) {
        vehicleComp.DestroyVehicle();
        vehicleComp.RepairVehicle();
        vehicleComp.DestroyMappin();
      }
      vehiclePS.UnlockAllVehDoors();
      vehicleComp.HonkAndFlash();
      objectName = obj.GetDisplayName();

    } else {
      drawPopup = false;
    }
  } else if (ImGui.IsKeyDown(0x10) && ImGui.IsKeyPressed(hotkey, false)) {
    drawPopup = true;

    const player = Game.GetPlayer();
    const obj = Game.GetTargetingSystem().GetLookAtObject(player, false, false);
    if (obj.IsNPC() && !obj.IsDead()) {
      obj.Kill(player, false, false);
      objectName = obj.GetDisplayName();

    } else if (obj.IsVehicle()) {
      const vehicleComp = obj.GetVehicleComponent();
      vehicleComp.ExplodeVehicle(player);
      vehicleComp.DestroyVehicle();
      objectName = obj.GetDisplayName();

    } else {
      drawPopup = false;
    }
  }
});

registerForEvent("onDraw", () => {
  ImGui.PushStyleColor(ImGuiCol.WindowBg, 0.21, 0.08, 0.08, 0.85);
  ImGui.PushStyleColor(ImGuiCol.Border, 0.4, 0.17, 0.12, 1);
  ImGui.PushStyleColor(ImGuiCol.Separator, 0.4, 0.17, 0.12, 1);

  if (drawPopup) {
    ImGui.Begin("Popup", true, ImGuiWindowFlags.NoResize | ImGuiWindowFlags.NoMove | ImGuiWindowFlags.NoTitleBar | ImGuiWindowFlags.AlwaysAutoResize);
    ImGui.SetWindowPos(width / 2, height / 2);
    ImGui.SetWindowFontScale(1.6);

    ImGui.Spacing()
    ImGui.TextColored(0.2, 1, 1, 1, "DATA")
    ImGui.Spacing()
    ImGui.Spacing()
    ImGui.Spacing()
    ImGui.TextColored(1, 0.36, 0.35, 1, "SCAN RESULTS")
    ImGui.Spacing()
    ImGui.TextColored(0.98, 0.85, 0.25, 1, objectName)
    ImGui.Spacing()
    ImGui.End()
  }
});
