---
title: Simple Web App in GCP
author: Dan Rogers
description: >
  Describes a simple web app built using GCP that stores data in Firestore
  and images in GCS (Google Cloud Storage).  Detailed code samples for these
  processes are provided for easy reference/copying.  We also show how to
  dockerize the app and deploy it using GCP Cloud Run to run it at a fraction
  of the cost of GCP App Engine.
date: 2021-03-03
image: "preview.png"
tags: ["web development", "gcp", "firestore", "gcs", "cloud run"]
---

## Overview

Recently, I worked on a small, simple web app that basically just had the need to store data submitted by a user and then show it back to them again at a later date.  The data we wanted to store came in two types:

1. Free-form text data (text responses to questions)
2. Images

I decided to build this app in Google Cloud Platform (GCP) because they tend to have the best prices and because I like the simplicity of their offerings.  I used React for the front-end and Java+Dropwizard for the backend web service.  Firestore was used for storing the basic text data and GCS (Google Cloud Storage) was used to store the images.  When it came time to deploy the website, I was able to deploy the front-end as a static website.  The backend was deployed using GCP Cloud Run which proved to be a very cost-effective way to run a simple web service.

This project taught me a lot about some fundamental patterns that are useful in pretty much all web apps.  This page is going to document those key patterns.

## Using Firestore

Firestore is an unstructured database similar to MongoDB that allows you to store data with a great deal of flexibility and ease.  You don't have to define a schema for your objects.  It also runs on technology that does not require a server to be running 24/7.  You essentially only are billed for the price of data storage and by the number of reads and writes you do on the data.  This is it's big benefit over MongoDB in the cloud: the costs are dramatically lower - especially for data that is not being read frequently.

At first, I was going to use Datastore since that's a product I've used in the past built for the same purpose, but when creating a Datastore database it now asks if you want to instead upgrade to Firestore.  The primary improvement I noticed in Firestore was a better API, and since everything I read seemed to imply that Datastore was going away and being completely replaced with Firestore in the future, I decided to go ahead and make the change now.

My Dropwizard configuration to load a Firestore object looks like this:

```
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;

import io.dropwizard.Configuration;

public class MyAppConfiguration extends Configuration {

	String gcpProjectId = "myprojectid";
	String firestoreCollectionId = "mycollection";

	public String getGcpProjectId() {
		return gcpProjectId;
	}
	public String getFirestoreCollectionId() {
		return firestoreCollectionId;
	}

	public Firestore getFirestoreDb() throws IOException {

		FirestoreOptions firestoreOptions =
				FirestoreOptions.getDefaultInstance().toBuilder()
				.setProjectId(gcpProjectId)
				.setCredentials(GoogleCredentials.getApplicationDefault())
				.build();

		Firestore db = firestoreOptions.getService();
		return db;
	}

}
```

The Google credentials will be loaded automatically in the production environment.  In our test environment we have to export those credentials, save them to a file, and then set the environmental variable below in order to make them accessible to the app:

```
export GOOGLE_APPLICATION_CREDENTIALS='/path/to/credentials.json'
```

Our web service resource that interacts with Firestore and performs basic CRUD (Create, Read, Update, Delete) operations looks like this:

```
@Path("/forms")
@Produces(MediaType.APPLICATION_JSON)
public class FormResource {

    private final Firestore db;
    private final String collectionId;

    public FormResource(Firestore db, String collectionId) {
        this.db = db;
        this.collectionId = collectionId;
    }

    // ### CREATE ##############################################################

    @POST
    public CreateResponse createForm() throws InterruptedException, ExecutionException {
    	String id = UUID.randomUUID().toString();
    	DocumentReference docRef = db.collection(collectionId).document(id);

		  Map<String, Object> data = new HashMap<>();
		  data.put("created", LocalDateTime.now().toString());
		  docRef.create(data).get();

		  return new CreateResponse(id);
    }

    // ### READ ################################################################

    @GET
    @Path("/{id}")
    public Optional<Form> getForm(@PathParam("id") String id) throws InterruptedException, ExecutionException {
    	DocumentReference docRef = db.collection(collectionId).document(id);
    	DocumentSnapshot doc = docRef.get().get();
    	if (!doc.exists())
    		return Optional.absent();

    	Form form = doc.toObject(Form.class);
    	form.setId(id);
    	return Optional.of(form);
    }

    // ### UPDATE ##############################################################

    @POST
    @Path("/{id}/basic")
    public Optional<RespondResponse> submitBasicInfo(
    		@PathParam("id") String id,
    		@NotNull @Valid BasicInfoRequest request) throws InterruptedException, ExecutionException {

    	DocumentReference docRef = db.collection(collectionId).document(id);
    	DocumentSnapshot doc = docRef.get().get();
    	if (!doc.exists())
    		return Optional.absent();

    	docRef.update("firstName", request.getFirstName(),
    			          "text", request.getText()).get();

    	return Optional.of(new RespondResponse(true));
    }

    // ### DELETE ##############################################################

    @DELETE
    @Path("/{id}")
    public DeleteResponse deleteForm(@PathParam("id") String id) throws InterruptedException, ExecutionException {
    	DocumentReference docRef = db.collection(collectionId).document(id);
    	DocumentSnapshot doc = docRef.get().get();
    	if (!doc.exists())
    		return DeleteResponse.error(id, "Form not found");

    	Form form = doc.toObject(Form.class);
    	//TODO: delete any associates images/files

    	//delete form object:
    	docRef.delete().get();

    	return DeleteResponse.success(id);
    }

    // ### LIST ################################################################

    @GET
    @Path("/")
    public ListFormsResponse listForms() throws InterruptedException, ExecutionException {
    	Query query = db.collection(collectionId).orderBy("created", Direction.DESCENDING).limit(50);
    	List<QueryDocumentSnapshot> docs = query.get().get().getDocuments();

    	List<Form> forms = new ArrayList<>();
    	for (QueryDocumentSnapshot doc : docs) {
    		Form form = doc.toObject(Form.class);
    		form.setId(doc.getId());
    		forms.add(form);
    	}

    	return new ListFormsResponse(forms);
    }

}
```

This is all that's needed to create a web service with the following endpoints:

| Action | Path              | Description                         |
|--------|-------------------|-------------------------------------|
| GET    | /forms/           | List all objects                    |
| POST   | /forms/           | Create a new object                 |
| GET    | /forms/{id}       | Get a specific object               |
| DELETE | /forms/{id}       | Delete a specific object            |
| POST   | /forms/{id}/basic | Upload basic info (the form header) |

The code is mostly self-explanatory, but there are a few things worth noting here:

1. We created our own ID for each object using a random UUID.
2. The ID property is not stored in the document by default (causing us to set it explicitly using ```form.setId(doc.getId)``` if we want to see it on our return object).
3. The Firestore document is basically a Map of key/value pairs.
4. We initialize a new object using a Map.
5. When we update the object we specify the properties/keys we want to update.
6. All of the Firestore operations are asynchronous (such as ```docRef.delete()```). We call ```get()``` on the asynchronous result to get the result in a way that blocks until the operation is complete. (```docRef.delete().get()```).

One other note - not related to Firestore - is the use of ```Optional<Form>``` in our return value.  This is used by Dropwizard and will automatically throw a 404 NOT FOUND error if we return an absent value.

## Storing Images in GCS

So far we have only shown the web service code that pertained to Firestore, but part of this project was also to store files in GCS.  In order to handle the file operations, a helper object was created that looked like this:

```
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

import org.glassfish.jersey.media.multipart.FormDataBodyPart;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;

public class FileManager {

	Storage storage;         // = "myappstorage";
	String bucketName;       // = "myappbucket";
	String objectIdPrefix;   // = "images/";

	public FileManager(Storage storage, String bucketName, String objectIdPrefix) {
		this.storage = storage;
		this.bucketName = bucketName;
		this.objectIdPrefix = objectIdPrefix;
	}

	public void uploadFile(String id, FormDataBodyPart body, InputStream in) throws IOException {
		Map<String, String> metadata = new HashMap<>();
		metadata.put("filename", body.getFormDataContentDisposition().getFileName());

		String objectId = objectIdPrefix + id;
	  BlobId blobId = BlobId.of(bucketName, objectId);
	  BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
	  		.setContentType(body.getMediaType().toString())
	   		.setMetadata(metadata)
	   		.build();

    storage.createFrom(blobInfo, in);
	}

	public Response getStreamingFileResponse(String id) {
		String objectId = objectIdPrefix + id;
		BlobId blobId = BlobId.of(bucketName, objectId);
		final Blob blob = storage.get(blobId);
		if (blob == null || !blob.exists()) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}

		return Response.ok(new StreamingOutput() {

			@Override
			public void write(OutputStream output) throws IOException, WebApplicationException {
				blob.downloadTo(output);
				output.flush();
			}

		}, blob.getContentType()).build();
	}

	public void delete(String id) {
		String objectId = objectIdPrefix + id;
		BlobId blobId = BlobId.of(bucketName, objectId);
		final Blob blob = storage.get(blobId);
		if (blob != null && blob.exists()) {
			blob.delete();
		}
	}

}
```

This handles the GCS-specific aspects of storing the file, retrieving the file, and deleting it.  If we were to ever change our image storage backend, we should be able to just create a new implementation of this class and use it in our web service.

The details of this object will be discussed below.  We post the code in full though so it's easier to copy.

### Uploading a File

The file upload is the most difficult part of this operation.  In our web service we define the following function:

```
@POST
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Path("/{id}/submitfile/{qid}")
public Optional<FormResponse> submitFile(
		@PathParam("id") String id,
		@PathParam("qid") int qid,
		@FormDataParam("file") final InputStream in,
		@FormDataParam("file") final FormDataBodyPart body) throws InterruptedException, ExecutionException, IOException {

  	DocumentReference docRef = db.collection(collectionId).document(id);
  	DocumentSnapshot doc = docRef.get().get();
  	if (!doc.exists()) {
  		return Optional.absent();
  	}

  	String imageId = id + "-" + String.valueOf(qid);
  	fileManager.uploadFile(imageId, body, in);

  	Form form = doc.toObject(Form.class);
  	form.setTextResponse(qid, "image:" + imageId);

  	docRef.update("questions", form.getQuestions()).get();

  	return Optional.of(FormResponse.success(form));
}
```

In order to receive a file upload in Dropwizard, we let the user POST data as MediaType.MULTIPART_FORM_DATA.  We can then receive the file in two pieces:

1. An InputStream from which we can read the file contents
2. A FormDataBodyPart providing information about the file

The FileManager code that handles the upload details for us then does this:

```
public void uploadFile(String id, FormDataBodyPart body, InputStream in) throws IOException {
  Map<String, String> metadata = new HashMap<>();
  metadata.put("filename", body.getFormDataContentDisposition().getFileName());

  String objectId = objectIdPrefix + id;
  BlobId blobId = BlobId.of(bucketName, objectId);
  BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
      .setContentType(body.getMediaType().toString())
      .setMetadata(metadata)
      .build();

  storage.createFrom(blobInfo, in);
}
```

This first two lines aren't really necessary.  Here we are grabbing the original file name that the user provided on the file and storing it as metadata on the GCS file object.  I only did this because I was curious as to what the user originally named the file.  After this we do the real work:

* Creating an object ID (in this case using a prefix so we can have something like ```/images/<id>-1```)
* Creating a BlobId that combines the target bucket with the object ID
* Setting some metadata on this blob (```setContentType()``` is important since we capture the original MIME type and can use this when returning the image to render it properly)
* Create the blob, copying content from the InputStream ```in```

When testing this, I created a simple HTML form to submit a file to the web service running locally on a form that I had already created:

```
<form enctype="multipart/form-data" method="POST" action="http://localhost:8080/forms/5de8f986-9a86-49cb-8f00-43b269cdf99b/submitfile/1">
  <input type="file" id="file" name="file" accept="image/*" />
  <input type="hidden" id="fileName" name="fileName" />
  <input type="submit" value="Upload" />
</form>
```

In the final React application we create a similar form, but we intercept the submit method and instead invoke it ourselves using axios.  This code is defined in a JavaScript service object and looks like:

```
submitFile(gameId, qid, file) {
  const url = this.baseUrl + "/" + gameId + "/respondfile/" + qid;

  const formData = new FormData();
  formData.append('file',file)

  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  }

  return axios.post(
    url,
    formData,
    config);
}
```

You can see that we first construct the URL for our endpoint.  Then we create a FormData object as our request body and submit it with the appropriate content-type.  The file object is captured from the file input control whenever a new file is selected by intercepting the value of ```event.target.files[0]``` and storing it in a state variable.  Then we can pass this along to the above code when the form is submitted.

This covers all the details of the file upload process.  You'll notice the original web service method does a bit more than just store the file though.  It also stores a reference to the file in our Firestore document.  This might not always be necessary, but in our case the users often have an option of submitting either text or an image for various questions.  When they submit an image we store it as a text result and prefix it with "image:" so we know to look for the referenced image in GCS.  We can also use this when our Form gets deleted to find all of the referenced images and delete them in GCS before deleting the main Firestore object.

### Download a File

I promise: downloading a file is __much__ easier than uploading one.  Our web service code simply captures an image ID and delegates everything to the FileManager:

```
@GET
@Path("/images/{id}")
public Response getImage(@PathParam("id") String id) {
	return fileManager.getStreamingFileResponse(id);
}
```

The FileManager method then does the following:

```
public Response getStreamingFileResponse(String id) {
  String objectId = objectIdPrefix + id;
  BlobId blobId = BlobId.of(bucketName, objectId);
  final Blob blob = storage.get(blobId);
  if (blob == null || !blob.exists()) {
    return Response.status(Response.Status.NOT_FOUND).build();
  }

  return Response.ok(new StreamingOutput() {

    @Override
    public void write(OutputStream output) throws IOException, WebApplicationException {
      blob.downloadTo(output);
      output.flush();
    }

  }, blob.getContentType()).build();
}
```

This will:

1. Combine the image ID with our prefix to get the object ID
2. Combine the object ID with the bucket name to get a BlobId
3. Ensure the BlobId exists (or else return a NOT_FOUND response)
4. Return a streaming response object that copies the blob's content to the response object

Notice that the streaming response also takes a MIME type parameter indicating the type of file we are returning.  In this case we retrieve the MIME type that was originally sent to us with the image so whether its a JPG, PNG, GIF, or whatever, it should render correctly.

In some cases you might not even need to worry about streaming back the images you store.  If the images are in a GCS bucket that is exposed to the internet (allowing everyone to read it) users can access the file directly using the GCS public URL. This was actually the case in my application because we stored the images in the same bucket as we stored our website code.  Both were made accessible to the internet, and setup to be accessed under my website's domain name.  This meant that the URL to access a file was a nice one of the form ```mysite.com/images/<id>-<qid>``` and could be accessed just as easily as ```mysite.com/index.html```.  The benefit of this approach is that you don't have to pay the associated costs of using your web service to stream back image data.  GCS will stream it back to the user just as efficiently (perhaps even moreso) and for free.  Of course, if you want to enforce any kind of application-level security around your images, you will want to lock down your GCS bucket and ensure users are properly authenticated before returning images to them.

### Deleting a File

Deleting a file is the easiest operation of all:

```
public void delete(String id) {
  String objectId = objectIdPrefix + id;
  BlobId blobId = BlobId.of(bucketName, objectId);
  final Blob blob = storage.get(blobId);
  if (blob != null && blob.exists()) {
    blob.delete();
  }
}
```

We don't have an endpoint that explictly deletes files.  Instead, when the user deletes their Form we will find all the images and call ```delete()``` in the FileManager ourselves to delete each one.  So far performance has been good and a few dozen images can be deleted without any noticeable lag in the web app.

## Using Cloud Run to Deploy the Web Service

Lastly, I'll cover how we use Cloud Run to deploy the web service.  (We already mentioned that the front-end was deployed as a static website using GCS.  This is a straightforward and well-documented process, so we don't discuss it here.)  When deploying a web service, we have several options.  Google's App Engine seems to be the best fit for a production-level web service that needs to be "always on".  However, the cost of an "always on" web service is that you have to pay for at least 1 server to always be running, and the cost of the App Engine server (and memory) are actually much higher than just buying your own Compute Engine instance and running your app there.  I'd prefer a cheaper solution.  This is where Cloud Run came in to save the day.

Cloud Run lets you run a dockerized web service in a way that scales to zero - if you want.  If the web service isn't used for 15 minutes, it automatically shuts down.  It will start back up again when someone tries to use it.  It can also auto-scale beyond a single instance if need be.  With Dropwizard we have a very fast start-up time: about 2 seconds.  This lag is definitely noticeable when you use the app for the first time in a while, but the savings are substantial: at least 95% less than an "always-on" service like App Engine if you only expect to use the service 5% of the time.

We can dockerize our Dropwizard web service quite easily.  All it takes is the following Dockerfile:

___Dockerfile___

```
FROM java:8-jre
EXPOSE 8080

COPY env/prod.yml /app/
COPY target/my-app-0.0.1.jar /app/

WORKDIR /app/
CMD ["java", "-jar", "my-app-0.0.1.jar", "server", "prod.yml"]
```

This assumes you have already built the "fat" jar file "target/my-app-0.0.1.jar" using something like ```mvn clean package```.  Then all you need is a docker image with Java 8 available.  You copy over your prod config file and your application.  Set the working directory, and fire up your app.  Cloud Run expects your web services to be listening to port 8080.  Dropwizard does this automatically, so all we have to do is make sure we expose that port from our image (as we do in line 2).

### Deploying to GCP

To use your dockerized web app with Cloud Run, you need to make it accessible in a docker repository in GCP.  You first build the image in the usual way:

```
docker build -t my-app:0.0.1 .
```

Next, you will push that image to GCP.  You should have docker connected to GCP by running:

```
gcloud auth configure-docker
```

Then you can tag and push the docker image to GCP with:

```
docker tag my-app:0.0.1 gcr.io/my-app:0.0.1
docker push gcr.io/my-app:0.0.1
```

Now you can login to Google Cloud Run and run and setup a Cloud Run service that uses this container.  You will need to specify the size of the machines you want to run.  (I started with 2 CPU and 2 GB of RAM, scalable from 0 to 10 nodes.)  The service will then be available at a URL such as:

* https://my-app-cmj7lj9osq-uk.a.run.app

After your initial deploy you can later upload new docker images and tell Cloud Run to use these images instead.  These updates will not affect the URL of your web service.

## Conclusion

This has been a long entry, but it contains a lot of re-usable code and patterns for future projects.  The main topics we have covered here are:

1. Using Firestore as a backend database for your website
2. Uploading files for your website and storing them in GCS
3. The Dropwizard web service code that enables this
4. Dockerizing your app and running it cheaply with Cloud Run

Any type of website that stores generic data or images/files can make use of these same patterns.  I was hoping to provide some cost estimates for what it takes to run this type of website, but so far my use of Firestore and Cloud Run have not exceeded the "free tier" usage, so the cost has been $0.  The most expensive part of my solution is still the Load Balancer that redirects traffic from a static IP address (for use with my website domain name) to GCS storage.  This is costing about $16/month.
