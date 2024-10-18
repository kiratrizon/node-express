const express = require('express');
const router = express.Router();
const SubjectModel = require('../../../libs/Model/Subject');
const Subject = new SubjectModel();

router.post('/', async (req, res) => {
    let obj = {
        'conditions':{
            'Subject.subject_id':23
        }
    };

    try {
        let subjects = await Subject.find('first',obj);
        res.status(200).json({'subjects': subjects});
    } catch (error) {
        res.status(500).json({ error: error });
    }

});

router.get('/page/:pageCount?', async (req, res) => {
    // Get the page count from the URL parameter
    const pageCount = parseInt(req.params.pageCount) || 1; // Default to page 1 if not specified
    const pageSize = 10; // Define the number of records per page

    let obj = {
        conditions: {},
        // joins: [
        //     {
        //         table: 'departments',
        //         as: 'Department',
        //         conditions: { "Department.dept_id": ["=", "Subject.department"] }
        //     }
        // ],
        // Add limit and offset for pagination
        limit: pageSize,
        offset: (pageCount - 1) * pageSize // Calculate offset
    };

    try {
        let totalSubjects = await Subject.count(obj);
        let subjects = await Subject.find('list', obj); // Use 'list' to fetch multiple records

        // Optionally, you can also get the total count for pagination metadata
        const totalPages = Math.ceil(totalSubjects / pageSize); // Calculate total pages

        // Send the response with subjects and pagination info
        res.status(200).json({
            subjects,
            pagination: {
                currentPage: pageCount,
                pageSize,
                totalCount: totalSubjects,
                totalPages,
                hasPrevious: pageCount > 1,
                hasNext: pageCount < totalPages
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});


router.get('/:id?', async (req, res) => {
    let id = req.params.id ?? null;
    let obj = {
        conditions: {
        },
        joins: [
            {
                table: 'departments',
                as: 'Department',
                conditions: {"Department.dept_id":["=","Subject.department"]}
            }
        ]
    };
    if (id !== null) {
        obj.conditions['Subject.subject_id'] = ['=', id];
    }

    try {
        let subjects = await Subject.find('first',obj);
        res.status(200).json({'subjects': subjects});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

module.exports = router;