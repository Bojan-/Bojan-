import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.*;
import java.util.List;

public class MessageExchange {

    public class Line {
    	String id;
    	String user;
    	String message;
    };

    private JSONParser jsonParser = new JSONParser();

    public String getToken(int index) {
        Integer number = index * 8 + 11;
        return "TN" + number + "EN";
    }

    public int getIndex(String token) {
        return (Integer.valueOf(token.substring(2, token.length() - 2)) - 11) / 8;
    }

    public String getServerResponse(List<String> messages) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("messages", messages);
        jsonObject.put("token", getToken(messages.size()));
        return jsonObject.toJSONString();
    }

    public String getClientSendMessageRequest(String message) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("message", message);
        return jsonObject.toJSONString();
    }

    public Line getClientMessage(InputStream inputStream) throws ParseException {
	Line l = new Line ();
	JSONObject jsonObject = getJSONObject(inputStreamToString(inputStream));
	l.id = (String) jsonObject.get("id");
	l.user = (String) jsonObject.get("user");
	l.message = (String) jsonObject.get("message");
        return l;
    }

    public String getClientId(InputStream inputStream) throws ParseException {
	JSONObject jsonObject = getJSONObject(inputStreamToString(inputStream));
	return (String) jsonObject.get("id");
    }

    public JSONObject getJSONObject(String json) throws ParseException {
        return (JSONObject) jsonParser.parse(json.trim());
    }

    public String inputStreamToString(InputStream in) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int length = 0;
        try {
            while ((length = in.read(buffer)) != -1) {
                baos.write(buffer, 0, length);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new String(baos.toByteArray());
    }
}
