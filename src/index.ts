import { checkAndNotifyEcoleDirecte } from "./apps/ecoledirecte";
import { checkAndNotifyIzly } from "./apps/izly";

await checkAndNotifyIzly();
await checkAndNotifyEcoleDirecte();
