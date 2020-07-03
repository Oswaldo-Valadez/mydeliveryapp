import I18n from "i18n-js";

import en from "./en";
import es from "./es";

I18n.fallbacks = true;
I18n.translations = {
    en,
    es
};

export default I18n;