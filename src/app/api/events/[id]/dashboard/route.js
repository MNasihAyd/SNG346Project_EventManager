//Adepted from: Gemini in response to creating a route for fetching event dashboard data for organisers in our project.

import { getEventDashboard } from '../../../../../controllers/eventController.js';
import { authenticate, authorize } from '../../../../../middlewares/authMiddleware.js';

export async function GET(req, { params }) {
  try {
    // Extract the event ID from the route parameters
    const { id } = await params;
    
    // Authenticate the user and ensure they have the ORGANISER role
    const user = authenticate(req);
    authorize(user, ["ORGANISER"]); 

    // Fetch the dashboard data for the specified event and user
    const dashboardData = await getEventDashboard(id, user);

    //Return the dashboard data as JSON with a 200 status code
    return Response.json(dashboardData, { status: 200 });

  } 
  // Map specific controller errors to standard HTTP status codes
  catch (err) {
    let status = 500;
    if (err.message === "Forbidden") status = 403;
    if (err.message === "Unauthorized") status = 401;
    if (err.message === "Event not found") status = 404;
    
    // Return the error message with the appropriate status code
    return Response.json({ error: err.message }, { status });
  }
}