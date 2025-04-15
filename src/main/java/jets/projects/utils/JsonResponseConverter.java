package jets.projects.utils;

import java.time.LocalDate;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;

public class JsonResponseConverter {

    private static final Gson PRETTY_GSON;

    static {
        PRETTY_GSON = new GsonBuilder()
                .registerTypeAdapter(LocalDate.class, (JsonSerializer<LocalDate>) (src, typeOfSrc, context) -> new JsonPrimitive(src.toString()))
                .setPrettyPrinting()
                .create();
    }

    private JsonResponseConverter() {
        // Prevent instantiation
    }

    /**
     * Converts data to pretty-printed JSON with success flag
     *
     * @param data Can be a single object or a Collection
     * @param success Boolean to indicate operation success
     * @return Formatted JSON string: {success: boolean, data: ...}
     */
    public static String toJsonResponse(Object data, boolean success) {
        JsonElement dataJson = PRETTY_GSON.toJsonTree(data);

        JsonObject result = new JsonObject();
        result.addProperty("success", success); // Dynamic success value
        result.add("data", dataJson);

        return PRETTY_GSON.toJson(result);
    }
}
