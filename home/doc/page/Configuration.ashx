<%@ WebHandler Language="C#" Class="Configuration" %>

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Xml;
using System.Configuration;
using System.Text;


public class Configuration : IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {

        if (context.Request.QueryString["method"] != null && Convert.ToString(context.Request.QueryString["method"]) !="post")
        {
            var s = context.Request.QueryString["method"].ToString();
            WebRequest request = WebRequest.Create(context.Request.QueryString["method"].ToString());
            request.Method = "GET";
            request.Credentials = new NetworkCredential("admin", "12345");
            string ResultString=null;
            string ContentType = null;
            byte[] array=null;
            try
            {
               
                using (var response = (HttpWebResponse)request.GetResponse())
                {
                    ResultString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                    ContentType = response.ContentType;
                    response.Close();
                    array = System.Text.Encoding.ASCII.GetBytes(ResultString);
                }
            }
            catch (Exception ex) 
            {
            }
            if (array == null)
            {
                context.Response.Clear();
                context.Response.AddHeader("HTTP/1.0", "500");
                context.Response.ContentType = ContentType;
                // context.Response.OutputStream.Write(array, 0, array.Length);
                context.Response.Flush();
            }
            else
            {
                context.Response.Clear();
                context.Response.AddHeader("HTTP/1.0", "200");
                context.Response.ContentType = ContentType;
                context.Response.OutputStream.Write(array, 0, array.Length);
            }

        }
        if(context.Request.QueryString["method"] != null && Convert.ToString(context.Request.QueryString["method"]) == "post")
        {
            var data = context.Request;
            var sr = new StreamReader(data.InputStream);
            string xmlData = sr.ReadToEnd();
            string path = context.Request.QueryString["PostMethod"].ToString();
            WebClient client = new WebClient();
            byte[] byteArray = Encoding.ASCII.GetBytes(xmlData);
            client.Credentials = new NetworkCredential("admin", "12345");
            client.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
            byte[] responseArray = client.UploadData(path, "PUT", byteArray);
            
            context.Response.Clear();
            context.Response.AddHeader("HTTP/1.0", "200");
            context.Response.ContentType = "application/xml";
            context.Response.OutputStream.Write(responseArray, 0, responseArray.Length);
            context.Response.Flush();
        }

    }
    public bool IsReusable {
        get {
            return false;
        }
    }

}