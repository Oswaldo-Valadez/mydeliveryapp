import I18n from "i18n-js";

import en from "./en";
import ar from "./ar";
import es from "./es";

I18n.fallbacks = true;
I18n.translations = {
    en,
    ar,
    es
};

export default I18n;