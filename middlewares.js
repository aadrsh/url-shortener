const WEB_SERVER_URL = process.env.WEB_SERVER_URL || "http://localhost:3000";

const authMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401);
    res.format({
        html: function () {
          res.redirect('/login');
        },
        json: function () {
          res.json({ error: 'Unauthorized' })
        },
        default: function () {
          res.type('txt').send('Unauthorized')
        }
      })
};

const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        if (req.isAuthenticated() && req.user.role === requiredRole) {
            return next();
        }
        res.status(403);
        res.format({
            html: function () {
                res.redirect(REDIRECT_SERVER_URL + "/forbidden.html");
            },
            json: function () {
                res.json({ error: 'Forbidden' });
            },
            default: function () {
                res.type('txt').send('Forbidden');
            }
        });
    };
};

module.exports = { authMiddleware, roleMiddleware };