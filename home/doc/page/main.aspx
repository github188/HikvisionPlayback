<%@ Page Language="C#" AutoEventWireup="true" CodeFile="main.aspx.cs" Inherits="main" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
    <title></title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" href="../css/base.css"  type="text/css" />
<link rel="stylesheet" href="../css/main.css"  type="text/css" />
    <script type="text/javascript" src="../script/jquery-1.7.1.min.js"></script>
<script type="text/javascript">
    var m_szHostName = '<%=mm_szHostName%>';
    var m_lHttpPort = '<%=m_lHttpPort%>';
    var m_lHttp = "http://";
    var m_lRtspPort = '<%=m_lRtspPort%>';
    var m_lUserName = '<%=m_UserName%>';
    var m_lPassword = '<%=m_Password%>';
    var m_channel = '<%=m_Channel%>';

    $(document).ready(function () {
        var EvercamApi = "https://api.evercam.io/v1";
        var cameraId = '<%=cameraId %>';
        var token = '<%=token %>';
        var apiId='<%=api_id %>';
        var apiKey='<%=api_key %>';

        var creditionals = new Object();
        if (apiId != '' && apiKey != '') {
            creditionals.api_id = apiId;
            creditionals.api_key = apiKey;
        }

        $.ajax({
            type: "GET",
            crossDomain: true,
            url: EvercamApi + "/cameras/" + cameraId + ".json",
            beforeSend: function (xhrObj) {
                if (token != '')
                    xhrObj.setRequestHeader("Authorization", "bearer " + token);
            },
            data: creditionals,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var cam = response.cameras[0];
                m_szHostName = cam.external.host;
                m_lHttpPort = cam.external.http.port;
                m_lRtspPort = cam.external.rtsp.port;
                m_lUserName = cam.cam_username;
                m_lPassword = cam.cam_password;
                getChannelNo(cam.model);
                initMain();
            },
            error: function (xhrc, ajaxOptionsc, thrownErrorc) {
                
            }
        });
    });
    function getChannelNo(nvrChnl) {
        switch (nvrChnl) {
            case 'NVR CH1':
                m_channel = 100;
            case 'NVR CH2':
                m_channel = 101;
            case 'NVR CH3':
                m_channel = 102;
            case 'NVR CH4':
                m_channel = 103;
            case 'NVR CH5':
                m_channel = 104;
            case 'NVR CH6':
                m_channel = 105;
            case 'NVR CH7':
                m_channel = 106;
            case 'NVR CH8':
                m_channel = 107;
            case 'NVR CH9':
                m_channel = 108;
            default:
                m_channel = 101;
        }
    }
</script>

<script type="text/javascript" src="../script/jquery.cookie.js"></script>
<script type="text/javascript" src="../script/common.js"></script>
<script type="text/javascript" src="../script/Translator.js"></script>
<script type="text/javascript" src="../script/main.js"></script>
</head>
<body onload="">
      
    	
    <div id="content"></div>
    
</body>
</html>