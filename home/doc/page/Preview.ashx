<%@ WebHandler Language="C#"  Class="Preview" %>

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Configuration;
using System.Xml;
using System.Configuration;


    public class Preview : IHttpHandler
    {
        string[] strArray;
        public void ProcessRequest(HttpContext context)
        {
            /*if (context.Request.QueryString["method"] != null)
            {
                
            }
            if (context.Request.QueryString["method"] != null)
            {
                WebRequest request = WebRequest.Create(context.Request.QueryString["method"].ToString());
                request.Method = "GET";
                request.Credentials = new NetworkCredential("admin", "12345");
                string ResultString;
                string ContentType;
                using (var response = (HttpWebResponse)request.GetResponse())
                {
                    ResultString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                    ContentType = response.ContentType;
                    response.Close();
                }
                byte[] array = System.Text.Encoding.ASCII.GetBytes(ResultString);
                context.Response.Clear();
                context.Response.AddHeader("HTTP/1.0", "200");
                context.Response.ContentType = ContentType;
                context.Response.OutputStream.Write(array, 0, array.Length);
                context.Response.Flush();

            }
            if (context.Request.QueryString["PostMethod"] != null)
            {
                var data = context.Request;
                var sr = new StreamReader(data.InputStream);
                var xmlData = sr.ReadToEnd();

                WebClient client = new WebClient();
                byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(xmlData);
                client.Credentials = new NetworkCredential("admin", "12345");
                client.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
                byte[] responseArray = client.UploadData(context.Request.QueryString["PostMethod"].ToString(), "POST", byteArray);
            }*/
            
            
            string method = context.Request.QueryString["method"].ToString().ToLower();
            string url = context.Request.QueryString["url"].ToString().ToLower();
            string userName = context.Request.QueryString["u"].ToString().ToLower();
            string password = context.Request.QueryString["p"].ToString().ToLower();
            string port = context.Request.QueryString["port"].ToString().ToLower();
            
            if (method == "GetDeviceInfo")
            {
                //GetDeviceInfo(url + ":" + port, userName, password);
                var m_szHostName = string.Format("http://{0}/PSIA/System/deviceInfo", url + ":" + port);
                byte[] array = System.Text.Encoding.ASCII.GetBytes(WebMethod(m_szHostName, userName, password));
                context.Response.Clear();
                context.Response.AddHeader("HTTP/1.0", "200");
                context.Response.ContentType = "application/xml";
                context.Response.OutputStream.Write(array, 0, array.Length);
                context.Response.Flush();

            }
            /*if (context.Request.QueryString["url"] != null)
            {
                string[] Array = context.Request.QueryString["url"].Split('@');
                if (Array.Length > 0)
                   strArray=Array[1].Split(':');
                else
                    strArray = Array[0].Split(':');
            }
            

            if (method == "mymethod1")
            {
                var m_szHostName = string.Format("http://{0}/PSIA/Custom/SelfExt/userCheck", strArray[0].ToString() + ":" + strArray[1].ToString());
                byte[] array = System.Text.Encoding.ASCII.GetBytes(WebMethod(m_szHostName));
                context.Response.Clear();
                context.Response.AddHeader("HTTP/1.0", "200");
                context.Response.ContentType = "application/xml";
                context.Response.OutputStream.Write(array, 0, array.Length);
                context.Response.Flush();

            }
            else if (method == "getdeviceinfo")
            {
                var m_szHostName = string.Format("http://{0}/PSIA/System/deviceInfo", strArray[0].ToString() + ":" + strArray[1].ToString());
                byte[] array = System.Text.Encoding.ASCII.GetBytes(WebMethod(m_szHostName));
                context.Response.Clear();
                context.Response.AddHeader("HTTP/1.0", "200");
                context.Response.ContentType = "application/xml";
                context.Response.OutputStream.Write(array, 0, array.Length);
                context.Response.Flush();

            }
            else if (method == "parsexml")
            {
                parseXml(context);
            }
            else if (method == "interfaces")
            {
                var m_szHostName = string.Format("http://{0}/PSIA/System/Network/interfaces", strArray[0].ToString() + ":" + strArray[1].ToString());
                byte[] array = System.Text.Encoding.ASCII.GetBytes(WebMethod(m_szHostName));
                context.Response.Clear();
                context.Response.AddHeader("HTTP/1.0", "200");
                context.Response.ContentType = "application/xml";
                context.Response.OutputStream.Write(array, 0, array.Length);
                context.Response.Flush();
            }
            else if (method == "status")
            {
                var m_szHostName = string.Format("http://{0}/PSIA/Custom/SelfExt/UPnP/ports/status", strArray[0].ToString() + ":" + strArray[1].ToString());
                byte[] array = System.Text.Encoding.ASCII.GetBytes(WebMethod(m_szHostName));
                context.Response.Clear();
                context.Response.AddHeader("HTTP/1.0", "200");
                context.Response.ContentType = "application/xml";
                context.Response.OutputStream.Write(array, 0, array.Length);
                context.Response.Flush();
            }
            else if (method == "channels")
            {
                var m_szHostName = string.Format("http://{0}/PSIA/System/Audio/channels", strArray[0].ToString() + ":" + strArray[1].ToString());
                byte[] array = System.Text.Encoding.ASCII.GetBytes(WebMethod(m_szHostName));
                context.Response.Clear();
                context.Response.AddHeader("HTTP/1.0", "200");
                context.Response.ContentType = "application/xml";
                context.Response.OutputStream.Write(array, 0, array.Length);
                context.Response.Flush();
            }
            else if (method == "patrols")
            {
                byte[] array = System.Text.Encoding.ASCII.GetBytes(patrols());
                context.Response.Clear();
                context.Response.AddHeader("HTTP/1.0", "200");
                context.Response.ContentType = "application/xml";
                context.Response.OutputStream.Write(array, 0, array.Length);
                context.Response.Flush();
            }
            else if (method == "initpattern")
            {
                byte[] array = System.Text.Encoding.ASCII.GetBytes(InitPattern());
                context.Response.Clear();
                context.Response.AddHeader("HTTP/1.0", "200");
                context.Response.ContentType = "application/xml";
                context.Response.OutputStream.Write(array, 0, array.Length);
                context.Response.Flush();

            }
            else if (method == "gettalknum")
            {
                byte[] array = System.Text.Encoding.ASCII.GetBytes(GetTalkNum());
                context.Response.Clear();
                context.Response.AddHeader("HTTP/1.0", "200");
                context.Response.ContentType = "application/xml";
                context.Response.OutputStream.Write(array, 0, array.Length);
                context.Response.Flush();

            }
             */
        }
        private string GetDeviceInfo(string ip, string username, string pass)
        {
            string[] strArray = GetIpPortAddByMachAddress().Split(':');
            var m_szHostName = string.Format("http://{0}/PSIA/System/deviceInfo/", strArray[0].ToString() + ":" + strArray[1].ToString());
            System.Net.WebRequest req = System.Net.WebRequest.Create(Convert.ToString(m_szHostName));
            req.Credentials = new NetworkCredential("admin", "12345");
            req.Method = "GET";


            string ResultString;
            string ContentType;
            using (var response = (HttpWebResponse)req.GetResponse())
            {
                ResultString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                ContentType = response.ContentType;
                response.Close();
            }


            return ResultString;

        }
        private string InitPattern()
        {
            /*   
              System.Net.WebRequest req = System.Net.WebRequest.Create("http://149.5.42.144:2953/PSIA/Custom/SelfExt/PTZ/channels/1/patterns");
              req.Credentials = new NetworkCredential("admin", "12345");
              req.ContentType = "application/json";
              req.Method = "GET";
              string ResultString;
              string ContentType;
              if ((HttpWebResponse)req.GetResponse() != null)
              {
                  using (var response = (HttpWebResponse)req.GetResponse())
                  {
                      ResultString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                      ContentType = response.ContentType;
                      response.Close();
                  }
              }
              else {
                  ResultString = null;
              }
              */
            string ResultString;
            return ResultString = "";


        }
        private string interfaces()
        {
            string[] strArray = GetIpPortAddByMachAddress().Split(':');
            var m_szHostName = string.Format("http://{0}/PSIA/System/Network/interfaces", strArray[0].ToString() + ":" + strArray[1].ToString());
            System.Net.WebRequest req = System.Net.WebRequest.Create(m_szHostName);
            req.Credentials = new NetworkCredential("admin", "12345");
            req.Method = "GET";
            string ResultString;
            string ContentType;
            using (var response = (HttpWebResponse)req.GetResponse())
            {
                ResultString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                ContentType = response.ContentType;
                response.Close();
            }
            return ResultString;
        }
        private string status()
        {
            string[] strArray = GetIpPortAddByMachAddress().Split(':');
            var m_szHostName = string.Format("http://{0}/PSIA/Custom/SelfExt/UPnP/ports/status", strArray[0].ToString() + ":" + strArray[1].ToString());
            System.Net.WebRequest req = System.Net.WebRequest.Create(m_szHostName);
            req.Credentials = new NetworkCredential("admin", "12345");
            req.Method = "GET";
            string ResultString;
            string ContentType;
            using (var response = (HttpWebResponse)req.GetResponse())
            {
                ResultString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                ContentType = response.ContentType;
                response.Close();
            }
            return ResultString;
        }
        private string WebMethod(string m_szHostName,string username, string pass)
        {
            WebRequest request = WebRequest.Create(Convert.ToString(m_szHostName));
            request.Method = "GET";
            request.Credentials = new NetworkCredential(username, pass);
            string ResultString;
            string ContentType;
            using (var response = (HttpWebResponse)request.GetResponse())
            {
                ResultString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                ContentType = response.ContentType;
                response.Close();
            }
            return ResultString;
        }
        private string patrols()
        {
            string[] strArray = GetIpPortAddByMachAddress().Split(':');
            var m_szHostName = string.Format("http://{0}/PSIA/PTZ/channels/1/patrols", strArray[0].ToString() + ":" + strArray[1].ToString());
            // WebRequest request = WebRequest.Create(m_szHostName);

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(m_szHostName);
            request.KeepAlive = false;
            // request.ProtocolVersion = HttpVersion.Version10;
            //request.UserAgent = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; .NET CLR 1.1.4322; .NET CLR 2.0.50727)";

            request.Method = "GET";
            request.Credentials = new NetworkCredential("admin", "12345");

            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            StreamReader reader = new StreamReader(response.GetResponseStream());
            string responseData = reader.ReadToEnd();
            return responseData;


        }
        private string channels()
        {
            string[] strArray = GetIpPortAddByMachAddress().Split(':');
            var m_szHostName = string.Format("http://{0}/PSIA/System/Audio/channels", strArray[0].ToString() + ":" + strArray[1].ToString());
            System.Net.WebRequest req = System.Net.WebRequest.Create(m_szHostName);
            req.Credentials = new NetworkCredential("admin", "12345");
            req.Method = "GET";
            string ResultString;
            string ContentType;
            using (var response = (HttpWebResponse)req.GetResponse())
            {
                ResultString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                ContentType = response.ContentType;
                response.Close();
            }
            return ResultString;

        }
        private void parseXml(HttpContext context)
        {
            string[] strArray = GetIpPortAddByMachAddress().Split(':');
            var m_szHostName = string.Format("http://{0}/doc/xml/version.xml", strArray[0].ToString() + ":" + strArray[1].ToString());
            System.Net.WebRequest req = System.Net.WebRequest.Create(m_szHostName);
            req.Credentials = new NetworkCredential("admin", "12345");
            req.Method = "GET";
            string ResultString;
            string ContentType;
            using (var response = (HttpWebResponse)req.GetResponse())
            {
                ResultString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                ContentType = response.ContentType;
                response.Close();
            }
            byte[] array = System.Text.Encoding.ASCII.GetBytes(ResultString);
            context.Response.Clear();
            context.Response.AddHeader("HTTP/1.0", "200");
            context.Response.ContentType = ContentType;
            context.Response.OutputStream.Write(array, 0, array.Length);
            context.Response.Flush();
        }
        private string CallWebService()
        {
            string[] strArray = GetIpPortAddByMachAddress().Split(':');
            var m_szHostName = string.Format("http://{0}/PSIA/Custom/SelfExt/userCheck", strArray[0].ToString() + ":" + strArray[1].ToString());
            System.Net.WebRequest req = System.Net.WebRequest.Create(m_szHostName);

            req.Credentials = new NetworkCredential("admin", "12345");
            req.Method = "GET";
            string ResultString;
            string ContentType;
            using (var response = (HttpWebResponse)req.GetResponse())
            {
                ResultString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                ContentType = response.ContentType;
                response.Close();
            }
            return ResultString;
        }
        private string GetTalkNum()
        {
            string[] strArray = GetIpPortAddByMachAddress().Split(':');
            var m_szHostName = string.Format("http://{0}/PSIA/Custom/SelfExt/TwoWayAudio/channels", strArray[0].ToString() + ":" + strArray[1].ToString());

            System.Net.WebRequest req = System.Net.WebRequest.Create(m_szHostName);
            req.Credentials = new NetworkCredential("admin", "12345");
            req.Method = "GET";
            string ResultString;
            string ContentType;
            using (var response = (HttpWebResponse)req.GetResponse())
            {
                ResultString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                ContentType = response.ContentType;
                response.Close();
            }
            return ResultString;
        }
        public string GetIpPortAddByMachAddress()
        {
            var machAddress = string.Format("http://212.78.237.158/XmlHandler.ashx?mac={0}&param=RealIpAddress", ConfigurationManager.AppSettings["MacAddress"].ToString());
            //   var machAddress = string.Format("http://213.239.205.82/XmlHandler.ashx?mac=004048A699A8&param=RealIpAddress");
            System.Net.WebRequest req = System.Net.WebRequest.Create(machAddress);

            //req.Credentials = new NetworkCredential("admin", "12345");
            req.Method = "GET";
            string ResultString;
            string ContentType;
            using (var response = (HttpWebResponse)req.GetResponse())
            {
                ResultString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                ContentType = response.ContentType;
                response.Close();
            }
            return ResultString;
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

    }
